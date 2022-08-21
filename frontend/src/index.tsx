import {
  default as React,
} from 'react'

import {
  createRoot
} from 'react-dom/client'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import {
  Game,
  Start,
  User,
  Leaderboard,
} from './pages';

import {
  Layout,
} from './components/layout';

import {
  FRONTEND_BASENAME,
} from './constants'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme}> */}
      {/* <CssBaseline/> */}
      <BrowserRouter basename={FRONTEND_BASENAME}>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='@/user' element={<User />} />
            <Route path='@/leaderboard' element={<Leaderboard />} />
            <Route path=':tag' element={<Game />} />
            <Route index element={<Start />} />
          </Route>
        </Routes>
      </BrowserRouter>
    {/* </ThemeProvider> */}
  </React.StrictMode>
)
