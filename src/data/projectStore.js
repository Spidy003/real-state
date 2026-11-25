import { projects as defaultProjects } from './projects'

const PROJECTS_KEY = 'aaa_projects'
const ENQUIRIES_KEY = 'aaa_enquiries'
const VISITS_KEY = 'aaa_site_visits'
const ACTIVITIES_KEY = 'aaa_admin_activities'

export function getAllProjects() {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY)
    if (!stored) return defaultProjects
    const custom = JSON.parse(stored)
    if (!Array.isArray(custom) || custom.length === 0) return defaultProjects
    // Merge: custom overrides default by id, plus any newly added projects
    const map = new Map(defaultProjects.map(p => [p.id, p]))
    custom.forEach(cp => {
      const base = map.get(cp.id) || {}
      map.set(cp.id, {
        ...base,
        ...cp,
        image: cp.image || base.image || defaultProjects[0].image,
        landmarks: cp.landmarks || base.landmarks || defaultProjects[0].landmarks,
      })
    })
    return Array.from(map.values())
  } catch {
    return defaultProjects
  }
}

export function getPublishedProjects() {
  return getAllProjects().filter(p => p.status === 'Published' || p.status === 'Upcoming' || p.status === 'Completed')
}

export function saveProject(project) {
  const all = getAllProjects()
  const idx = all.findIndex(p => p.id === project.id)
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...project }
    logAdminActivity(`Updated project "${project.title}" (${project.status})`)
  } else {
    all.push(project)
    logAdminActivity(`Created new project "${project.title}" (${project.status})`)
  }
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(all))
  window.dispatchEvent(new Event('aaa_data_updated'))
  return all
}

export function updateProjectStatus(id, status) {
  const all = getAllProjects()
  const updated = all.map(p => {
    if (p.id === id) {
      logAdminActivity(`Changed "${p.title}" status to ${status}`)
      return { ...p, status }
    }
    return p
  })
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event('aaa_data_updated'))
  return updated
}

export function getEnquiries() {
  try {
    return JSON.parse(localStorage.getItem(ENQUIRIES_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveEnquiries(data) {
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(data))
  window.dispatchEvent(new Event('aaa_data_updated'))
}

export function getSiteVisits() {
  try {
    return JSON.parse(localStorage.getItem(VISITS_KEY) || '[]')
  } catch {
    return []
  }
}

export function addSiteVisit(visit) {
  const visits = getSiteVisits()
  const newVisit = {
    id: `VIS-${new Date().getFullYear()}-${String(visits.length + 1).padStart(4, '0')}`,
    ...visit,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  }
  visits.push(newVisit)
  localStorage.setItem(VISITS_KEY, JSON.stringify(visits))
  logAdminActivity(`New site visit scheduled by ${visit.name} for ${visit.project}`)
  window.dispatchEvent(new Event('aaa_data_updated'))
  return newVisit
}

export function getAdminActivities() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]')
  } catch {
    return []
  }
}

export function logAdminActivity(text) {
  const activities = getAdminActivities()
  activities.unshift({
    id: Date.now().toString(),
    text,
    timestamp: new Date().toISOString(),
  })
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities.slice(0, 30)))
}
