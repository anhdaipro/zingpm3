import { useId } from "react"
import { useSelector,useDispatch } from "react-redux"
import {useEffect,useState} from "react"
import {settheme} from "../../actions/auth"
import styled from "styled-components"
const ThemeStyle=styled.div`
background:${props=>props.background};
border-radius: 8px;
max-height: 100%;
&.theme-modal--avtive{
display:flex;
position:fixed;
};
.theme-modal__body{
    width: 70vw;
    min-width:300px;
    max-width: 900px;
    padding-bottom: 20px;
    .theme-modal__close-btn{
        position: absolute;
        top: 15px;
        right: 15px;
        margin: 0;
        color:#fff;
    };
    .container {
        max-height: 50vh;
        min-height: 500px;
        padding: 0 30px;
        overflow-y: scroll;
    }
    .theme-modal__body-headding{
        font-size:16px;
        padding:16px 30px
    };
    
    .theme-modal__body-group-wrapper{
        max-height: 50vh;
        min-height: 500px;
        padding: 0 30px;
        overflow-y: scroll;
        
        .theme-modal__body-group{
            margin-bottom:20px;
            >.title{
                margin-bottom:12px;
                text-transform: capitalize;
                font-size: 14px;
            };
            .theme-modal__body-group-list{
                display:flex;
                flex-wrap:wrap;
                margin-left: -7px;
                margin-right: -7px;
                .theme-bg-image{
                    width:25%;
                    padding-left: 7px;
                    padding-right: 7px;
                    
                    .theme-actions{
                        flex-direction:column
                    };
                    
                    .title {
                        font-size: 12px;
                        text-transform: capitalize;
                    }
                    
                };
                @media (max-width: 1024px){
                    .theme-bg-image{            
                     width:33.333%;
                    }
                 };
                .theme-bg-image:hover .theme-actions{
                    visibility: visible;
                }
            }
        }
    };
    
    
};

`
const themes=[
    {theme:'dynamic',name:'London',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/London-thumb.png',background:'',className:'jack'},
    {theme:'dynamic',name:'Sáng tối',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/dynamic-light-dark-1.jpg',background:'',className:'jack'},
    {theme:'dynamic',name:'Xanh da trời',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/dynamic-blue.jpg',background:'',className:'jack'},
    {theme:'dynamic',name:'Hồng',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/dynamic-pink.jpg',background:'',className:'jack'},
    {theme:'artist',name:'Jack',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/jack.jpg',background:'',className:'jack'},
    {theme:'artist',name:'IU',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/iu.jpg',background:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme-background/iu.jpg',className:''},
    {theme:'artist',name:'Ji Chang Wook',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/ji-chang-wook.jpg',background:'',className:'jichangwook'},
    {theme:'artist',name:'Jisoo',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/jisoo.jpg',background:'',className:'jisoo'},
    {theme:'subject',name:'XONE',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/xone-thumbn.jpg'},
    {theme:'subject',name:'Zing music Awards',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/zma.jpg'},
    {theme:'subject',name:'Tháp Eiffel',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/eiffel.jpg'},
    {theme:'dark',name:'Tối',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/dark.jpg',background:''},
    {theme:'dark',name:'Tím',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/purple.jpg',background:''},
    {theme:'dark',name:'Xanh đậm',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/blue.jpg',background:''},
    {theme:'light',name:'Sánh',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/light.jpg',background:''},
    {theme:'light',name:'Xám',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/gray.jpg',background:''},
    {theme:'light',name:'Xanh nhạt',image:'https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/green-light.jpg',background:''},
]

const Theme=(props)=>{
    const dispatch = useDispatch()
    const theme=useSelector(state=>state.auth.theme)
    const {item}=props
    
    return(
    <div className={`theme-bg-image ${theme==item.image?'theme-active':''} is-desktop-20 is-touch-3 is-tablet-4`}>
        <div className="zm-card zm-card-theme">
            <div className="zm-card-image theme-image">
                <figure className="image image is-48x48">
                    <img src={item.image} alt=""/>
                </figure>
                
                <div className="opacity"></div>
                <div className="zm-box zm-actions theme-actions">
                    <div className="zm-btn mar-b-10">
                        <button onClick={()=>dispatch(settheme({theme:item.background}))} className="zm-btn active is-small is-upper button" tabindex="0">Áp dụng</button>
                    </div>
                    <button onClick={()=>dispatch(settheme({themepreview:item.background}))} className="zm-btn is-small is-upper button" tabindex="0">Xem trước</button>
                </div>
            </div>
            <div className="zm-card-content">
                <h4 className="title is-6">{item.name}</h4>
            </div>
        </div>
    </div>    
    )
}
const Themes=()=>{
    const auth=useSelector(state=>state.auth)
    const {theme,themepreview}=auth
    const dispatch = useDispatch()
    useEffect(()=>{
        const settheme=()=>{
            dispatch(settheme({themepreview:theme}))
        }
        window.addEventListener('beforeunload', settheme)
        return () => window.removeEventListener('beforeunload', settheme)
    },[theme])
    return(
        <div className="zm-portal-modal theme-modal-overlay">
            <ThemeStyle background={'#34224f'} className="theme-modal theme-modal--avtive">
                <div className="theme-modal__body">
                    <button onClick={()=>dispatch(settheme({themepreview:theme,showtheme:false}))} className="theme-modal__close-btn">
                    <svg viewBox="0 0 16 16" stroke="#EE4D2D" class="home-popup__close-button"><path stroke-linecap="round" d="M1.1,1.1L15.2,15.2"></path><path stroke-linecap="round" d="M15,1L0.9,15.1"></path></svg>
                    </button>
                    <h3 className="theme-modal__body-headding js__main-color" >Giao diện</h3>
                    <div className="theme-modal__body-group-wrapper">
                        <div className="theme-modal__body-group">
                            <h3 className="title" >Dynamic</h3>
                            <ul className="theme-modal__body-group-list">
                                {themes.filter(item=>item.theme==='dynamic').map(item=>
                                <Theme
                                item={item}
                                key={item.name}
                                />
                                )}
                            </ul>
                        </div>
    
                        <div className="theme-modal__body-group">
                            <h3 className="title" >Chủ đề</h3>
                            <ul className="theme-modal__body-group-list">
                                {themes.filter(item=>item.theme==='subject').map(item=>
                                    <Theme
                                    item={item}
                                    key={item.name}
                                    />
                                )}
                            </ul>
                        </div>
    
                        <div className="theme-modal__body-group">
                            <h3 className="title" >Nghệ Sĩ</h3>
                            <ul className="theme-modal__body-group-list">
                                {themes.filter(item=>item.theme==='artist').map(item=>
                                <Theme
                                item={item}
                                key={item.name}
                                />
                                )}
                                
                            </ul>
                        </div>
                        <div className="theme-modal__body-group">
                            <h3 className="title" >Màu tối</h3>
                            <ul className="theme-modal__body-group-list">
                                {themes.filter(item=>item.theme==='dark').map(item=>
                                <Theme
                                item={item}
                                key={item.name}
                                />
                                )}
                            </ul>
                        </div>
                        <div className="theme-modal__body-group">
                            <h3 className="title" >Màu sáng</h3>
                            <ul className="theme-modal__body-group-list">
                                {themes.filter(item=>item.theme==='light').map(item=>
                                <Theme
                                    item={item}
                                    key={item.name}
                                />
                                )}
                            </ul>
                        </div>
                    </div>   
                </div>
            </ThemeStyle>
        </div>
    )
}
export default Themes