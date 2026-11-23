import 'server-only'
import { Resend } from 'resend'
import type { LeadRow } from '@/lib/supabase/database.types'
import { labelProjectType, labelBudget, labelService } from '@/lib/leads/options'
import { absoluteUrl } from '@/lib/site-config'
import { log } from '@/lib/log'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type NotifyResult = 'sent' | 'skipped' | 'failed'

/**
 * Emails the admin about a new lead. The lead is already saved when this runs;
 * a failed or unconfigured email never turns a saved submission into an error.
 */
export async function notifyNewLead(lead: LeadRow): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const to = process.env.LEAD_NOTIFICATION_EMAIL?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()

  if (!apiKey || !to || !from) {
    log.warn('lead_notification_skipped', { reason: 'resend_not_configured', leadId: lead.id })
    return 'skipped'
  }

  const rows: Array<[string, string | null]> = [
    ['Origen', lead.source === 'quote' ? 'Formulario de cotización' : 'Formulario de contacto'],
    ['Alojamiento', lead.business_name],
    ['Tipo', labelProjectType(lead.accommodation_type)],
    ['Ubicación', lead.location],
    ['Sitio actual', lead.website],
    ['Unidades', lead.units ? String(lead.units) : null],
    ['Servicios', lead.services.length ? lead.services.map(labelService).join(', ') : null],
    ['Presupuesto', labelBudget(lead.budget)],
    ['Nombre', lead.full_name],
    ['Correo', lead.email],
    ['WhatsApp', lead.whatsapp],
  ]

  const tableRows = rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#5c6460;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;color:#252a28">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  const detailUrl = absoluteUrl(`/admin/leads/${lead.id}`)
  const html = `<!doctype html><html><body style="margin:0;background:#f3f2ed;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="margin:0 0 8px;color:#5c6460;font-size:12px;letter-spacing:2px;text-transform:uppercase">JoabStudios · Nuevo prospecto</p>
<h1 style="margin:0 0 24px;color:#172d29;font-size:24px">${escapeHtml(lead.business_name ?? lead.full_name)}</h1>
<table style="border-collapse:collapse;font-size:14px;line-height:1.5">${tableRows}</table>
${lead.message ? `<p style="margin:24px 0 8px;color:#5c6460;font-size:12px;text-transform:uppercase;letter-spacing:2px">Descripción</p><p style="margin:0;color:#252a28;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(lead.message)}</p>` : ''}
<p style="margin:32px 0 0"><a href="${escapeHtml(detailUrl)}" style="display:inline-block;background:#172d29;color:#f3f2ed;padding:12px 20px;border-radius:999px;text-decoration:none;font-size:13px">Abrir en el CRM</a></p>
</div></body></html>`

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: to.split(',').map((address) => address.trim()).filter(Boolean),
      replyTo: lead.email,
      subject: `Nuevo prospecto: ${lead.business_name ?? lead.full_name}`,
      html,
    })
    if (error) {
      log.error('lead_notification_failed', error, { leadId: lead.id })
      return 'failed'
    }
    return 'sent'
  } catch (error) {
    log.error('lead_notification_failed', error, { leadId: lead.id })
    return 'failed'
  }
}
