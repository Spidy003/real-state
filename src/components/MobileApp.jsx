import { useState } from 'react'
import MobileHome from './MobileHome'
import MobilePropertyList from './MobilePropertyList'
import MobileEMIView from './MobileEMIView'
import MobileFacilityView from './MobileFacilityView'
import FlatWalkthrough from './FlatWalkthrough'
import SiteVisitModal from './SiteVisitModal'
import './MobileApp.css'

export default function MobileApp({ theme, toggleTheme, onOpenEnquiry }) {
  // Views: 'home' | 'properties' | 'walkthrough' | 'emi' | 'facility'
  const [view, setView] = useState('home')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)
  const [visitModalProject, setVisitModalProject] = useState('AAA Builders')

  const openVisitModal = (proj) => {
    if (proj?.title) setVisitModalProject(`${proj.title} (${proj.location.split(',')[0]})`)
    setIsVisitModalOpen(true)
  }

  const goBack = () => {
    if (view === 'home') return
    if (view === 'properties') { setView('home'); return }
    setView('properties') // walkthrough / emi / facility → back to properties
    window.scrollTo(0, 0)
  }

  if (view === 'walkthrough' && selectedProject) {
    return (
      <FlatWalkthrough
        project={selectedProject}
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
          onCheckProperty={() => { setView('properties'); window.scrollTo(0,0) }}
          onOpenVisitModal={() => openVisitModal(null)}
          onOpenEnquiry={onOpenEnquiry}
        />
      )}

      {view === 'properties' && (
        <MobilePropertyList
          theme={theme}
          onBack={goBack}
          onViewIn3D={(proj) => { setSelectedProject(proj); setView('walkthrough'); window.scrollTo(0,0) }}
          onCheckEMI={(proj)  => { setSelectedProject(proj); setView('emi'); window.scrollTo(0,0) }}
          onCheckFacility={(proj) => { setSelectedProject(proj); setView('facility'); window.scrollTo(0,0) }}
          onOpenVisitModal={openVisitModal}
          onOpenEnquiry={onOpenEnquiry}
        />
      )}

      {view === 'emi' && selectedProject && (
        <MobileEMIView
          project={selectedProject}
          onBack={goBack}
          onOpenVisitModal={() => openVisitModal(selectedProject)}
        />
      )}

      {view === 'facility' && selectedProject && (
        <MobileFacilityView
          project={selectedProject}
          theme={theme}
          onBack={goBack}
          onOpenVisitModal={() => openVisitModal(selectedProject)}
        />
      )}

      <SiteVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        defaultProject={visitModalProject}
      />
    </div>
  )
}
