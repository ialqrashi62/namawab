/**
 * Patient Engagement — Engine
 */

'use strict';

const CITATIONS = { PDPL: 'PDPL Saudi 2024', WCAG: 'WCAG 2.1 AA' };

function goalSetting(input) {
  const { patient_id, goal_type, target_value, current_value, deadline_days } = input;
  const diff = target_value - current_value;
  return {
    goal_id: `GOAL-${Date.now()}`,
    patient_id, goal_type,
    target_value, current_value,
    delta_needed: Math.abs(diff),
    deadline_days,
    progress_pct: Math.min(100, (current_value / target_value) * 100),
    citation: CITATIONS.PDPL,
  };
}

function achievementBadge(input) {
  const { patient_id, achievement_type, criteria_met } = input;
  const badges = {
    'first_checkup': { name: 'First Steps', icon: '🌟', rarity: 'common' },
    '30_day_streak': { name: '30-Day Streak', icon: '🔥', rarity: 'rare' },
    'goal_achieved': { name: 'Goal Crusher', icon: '🏆', rarity: 'epic' },
    'chronic_control': { name: 'In Control', icon: '💪', rarity: 'rare' },
    'medication_adherence_90': { name: 'Med Hero', icon: '💊', rarity: 'epic' },
  };
  const badge = badges[achievement_type] || { name: achievement_type, icon: '⭐', rarity: 'common' };
  return {
    badge_id: `BDG-${Date.now()}`,
    patient_id,
    achievement_type,
    badge_name: badge.name,
    icon: badge.icon,
    rarity: badge.rarity,
    earned_at: new Date().toISOString(),
    criteria_met,
  };
}

function leaderboardGeneration(input) {
  const { scope, period, anonymized, tenant_id } = input;
  return {
    leaderboard_id: `LDR-${Date.now()}`,
    scope,
    period: period || 'monthly',
    anonymized: anonymized !== false,
    tenant_id,
    entries: [],
    citation: CITATIONS.PDPL,
  };
}

function appointmentReminder(input) {
  const { patient_id, appointment_date, channel, message } = input;
  return {
    reminder_id: `RMN-${Date.now()}`,
    patient_id,
    appointment_date,
    channel: channel || 'sms',
    message: message || 'Reminder: upcoming appointment',
    sent_at: new Date().toISOString(),
    status: 'scheduled',
  };
}

function educationalContentMatching(input) {
  const { patient_id, condition, language, reading_level } = input;
  return {
    content_id: `EDU-${Date.now()}`,
    patient_id,
    condition,
    language: language || 'ar',
    reading_level: reading_level || 'general',
    recommended_content: [],
    citation: CITATIONS.WCAG,
  };
}

function pushNotificationRouting(input) {
  const { patient_id, notification_type, payload, locale } = input;
  return {
    notification_id: `PUSH-${Date.now()}`,
    patient_id,
    type: notification_type,
    payload,
    locale: locale || 'ar',
    rtl: locale === 'ar' || locale === 'ur',
    delivered_at: new Date().toISOString(),
  };
}

module.exports = {
  goalSetting, achievementBadge, leaderboardGeneration,
  appointmentReminder, educationalContentMatching, pushNotificationRouting,
  CITATIONS,
};