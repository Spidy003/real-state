import './MobileApp.css'
import { useState, useEffect } from 'react'
import { getPublishedProjects } from '../data/projectStore'
import MobileHome from './MobileHome'
import MobilePropertyList from './MobilePropertyList'
import MobileEMIView from './MobileEMIView'
import MobileFacilityView from './MobileFacilityView'
import MobileAboutView from './MobileAboutView'
import MobileContactView from './MobileContactView'
import MobileMenuDrawer from './MobileMenuDrawer'
import FlatWalkthrough from './FlatWalkthrough'
import FloorPlanModal from './FloorPlanModal'
import SiteVisitModal from './SiteVisitModal'

export default function MobileApp({ theme, toggleTheme, onOpenEnquiry }) {
  // Views: 'home' | 'properties' | 'walkthrough' | 'emi' | 'facility' | 'about' | 'contact'
  const [view, setView] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [projectsList, setProjectsList] = useState(getPublishedProjects)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)
  const [visitModalProject, setVisitModalProject] = useState('AAA Builders')

  useEffect(() => {
    const sync = () => setProjectsList(getPublishedProjects())
    window.addEventListener('aaa_data_updated', sync)
    return () => window.removeEventListener('aaa_data_updated', sync)
  }, [])

  const activeProject = selectedProject || projectsList[0] || null

  const openVisitModal = (proj) => {
    if (proj?.title) setVisitModalProject(`${proj.title} (${proj.location.split(',')[0]})`)
    setIsVisitModalOpen(true)
  }

  const navigateTo = (targetView) => {
    if (targetView === 'enquiry') {
      onOpenEnquiry?.()
      return
    }
    if ((targetView === 'walkthrough' || targetView === 'emi' || targetView === 'facility') && !selectedProject && projectsList[0]) {
      setSelectedProject(projectsList[0])
    }
    setView(targetView)
    window.scrollTo(0, 0)
  }

  const goBack = () => {
    if (view === 'home') return
    if (view === 'properties' || view === 'about' || view === 'contact') {
      setView('home')
      window.scrollTo(0, 0)
      return
    }
    setView('properties')
    window.scrollTo(0, 0)
  }

  if (view === 'walkthrough' && activeProject) {
    return (
      <FlatWalkthrough
        project={activeProject}
        onBackToHome={goBack}
      />
    )
  }

  return (
    <div className="mobile-app-shell">
      {view === 'home' && (
        <MobileHome
          theme={theme}
          toggleTheme={toggleTheme}
          onCheckProperty={() => navigateTo('properties')}
          onOpenVisitModal={() => openVisitModal(null)}
          onOpenEnquiry={onOpenEnquiry}
          onOpenMenu={() => setMenuOpen(true)}
        />
      )}

      {view === 'properties' && (
        <MobilePropertyList
          theme={theme}
          onBack={goBack}
          onViewIn3D={(proj) => { setSelectedProject(proj); setView('walkthrough'); window.scrollTo(0, 0) }}
          onCheckEMI={(proj)  => { setSelectedProject(proj); setView('emi'); window.scrollTo(0, 0) }}
          onCheckFacility={(proj) => { setSelectedProject(proj); setView('facility'); window.scrollTo(0, 0) }}
          onOpenFloorPlan={(proj) => setSelectedFloorPlan(proj)}
          onOpenVisitModal={openVisitModal}
          onOpenEnquiry={onOpenEnquiry}
          onOpenMenu={() => setMenuOpen(true)}
        />
      )}

      {view === 'emi' && activeProject && (
        <MobileEMIView
          project={activeProject}
          projectsList={projectsList}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onBack={goBack}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenVisitModal={() => openVisitModal(activeProject)}
        />
      )}

      {view === 'facility' && activeProject && (
        <MobileFacilityView
          project={activeProject}
          projectsList={projectsList}
          onSelectProject={(proj) => setSelectedProject(proj)}
          theme={theme}
          onBack={goBack}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenVisitModal={() => openVisitModal(activeProject)}
        />
      )}

      {view === 'about' && (
        <MobileAboutView
          onBack={goBack}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenProjects={() => navigateTo('properties')}
          onOpenVisitModal={() => openVisitModal(null)}
        />
      )}

      {view === 'contact' && (
        <MobileContactView
          onBack={goBack}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenVisitModal={() => openVisitModal(null)}
          onOpenEnquiry={onOpenEnquiry}
        />
      )}

      <MobileMenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeView={view}
        onNavigate={navigateTo}
        onOpenVisitModal={() => openVisitModal(null)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <SiteVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        defaultProject={visitModalProject}
      />

      {selectedFloorPlan && (
        <FloorPlanModal
          project={selectedFloorPlan}
          onClose={() => setSelectedFloorPlan(null)}
          onOpenVisitModal={openVisitModal}
        />
      )}
    </div>
  )
}
