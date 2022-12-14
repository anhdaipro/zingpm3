import React from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import "./css/base.css"
import "./css/header.css"
import Layout from "./hocs/Layout"
import { Provider } from 'react-redux'
import store  from "./store"
import "./css/music.css"
import "./css/grid.css"
import "./css/sibar.css"
import "./css/home.css"
import "./css/user.css"
import "./css/login.css"
import "./css/theme.css"
import "./css/responsive.css"
import Homepage from './components/home/Homepage'
import Discover from './components/discover/Discover'
import Individual from './components/Individual/Individual'
import Follow from './components/follow/Follow'
import Genres from './components/genres/Genres'
import Detailgenre from './components/genres/Detailgenre'
import Artist from './components/follow/Artist'
import Top100 from './components/Top100'
import Newsongs from './components/Newsongs'
import PlaylistDetail from './components/Individual/PlaylistDetail'
import Profile from './components/Individual/Profile'
import Search from './components/home/Search'
import Newrelease from './components/discover/Newrelease'
import Artistdetail from './components/follow/Artistdetail'
import Listmv from './components/home/Listmv'
import Radio from './components/radio.js/Radio'
const App=()=>{ 
  return(
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>                     
                <Route exact path="zingchart" element={<Homepage/>}/>
                <Route exact path="tim-kiem/:choice" element={<Search/>}/> 
                <Route exact path="the-loai-video/:choice" element={<Listmv/>}/>
                <Route exact path="new-release/:choice" element={<Newrelease/>}/> 
                <Route exact path="mymusic" element={<Individual/>}/> 
                <Route exact path="/the-loai-nghe-si/:choice" element={<Follow/>}/> 
                <Route exact path="/" element={<Discover/>}/> 
                <Route exact path="hub" element={<Genres/>}/> 
                <Route exact path="album/:slug" element={<Detailgenre/>}/>
                <Route exact path="liveradio" element={<Radio/>}/>
                <Route path=":slugartist" element={<Artist/>}>
                  <Route path=":choice"/>    
                </Route>   
                <Route exact path="/mainfeed" element={<Follow/>}/>
                <Route  path="playlist/:slug/:id" element={<PlaylistDetail/>}/>   
                <Route exact path="top100" element={<Top100/>}/>    
                <Route  path="user/:username" element={<Profile/>}/> 
                
                <Route exact path="moi-phat-hanh" element={<Newsongs/>}/>       
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  )
}
export default App
  