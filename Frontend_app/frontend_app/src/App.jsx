
import './App.css'
import AuthProvider from './components/AuthProvider'
import ExplainArticle from './components/ExplainArticle'
import Header from "./components/Header"
import LoginOrRegister from './components/LoginOrRegister'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import PublicRoute from './components/PublicRoute'
import HistoricProvider from './components/HistoricProvider'
import DisplayProvider from './components/DisplayProvider'


function App() {
  return (
    <>
    <BrowserRouter>

      <AuthProvider>
        <DisplayProvider>
          <HistoricProvider>
            
            <Header />
            <Routes>
              <Route path="/" element={<ExplainArticle />} />
              <Route path="/LoginOrRegister" element={ <PublicRoute><LoginOrRegister /></PublicRoute> } />
            </Routes>
            
          </HistoricProvider>
        </DisplayProvider>
      </AuthProvider>

    </BrowserRouter>

    </>
  )
}

export default App
