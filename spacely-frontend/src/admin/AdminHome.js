import React from 'react'
import {Pane,Tablist,SidebarTab,Paragraph} from 'evergreen-ui';
import {Navbar} from 'react-bootstrap'
import PostPlace from "./adminTab/PostPlace"

import logo from "./src/logo/spacely_logo@2x.png"


export default function AdminHome() {
    function SidebarTabsExample() {
        const [selectedIndex, setSelectedIndex] = React.useState(0)
        const [tabs] = React.useState(['Post Place', 'Manage Places', 'Identities'])
      


        const chooseTab = (tab) => {
            if(tab == 'Post Place'){
                return (
                    <div>
<PostPlace/>
                    </div>
                )
            }
            if(tab ==  'Manage Places'){
                return (
                    <h4>
                        {tab}
                    </h4>
                )
            }
        }

        return (
          <Pane display="flex" height={240}>
            <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
              {tabs.map((tab, index) => (
                <SidebarTab
                  key={tab}
                  id={tab}
                  onSelect={() => setSelectedIndex(index)}
                  isSelected={index === selectedIndex}
                  aria-controls={`panel-${tab}`}
                >
                  {tab}
                </SidebarTab>
              ))}
            </Tablist>
            <Pane padding={16} background="tint1" flex="1">
              {tabs.map((tab, index) => (
                <Pane
                  key={tab}
                  id={`panel-${tab}`}
                  role="tabpanel"
                  aria-labelledby={tab}
                  aria-hidden={index !== selectedIndex}
                  display={index === selectedIndex ? 'block' : 'none'}
                >
               <div>
                    {chooseTab(tab)}
               </div>
                </Pane>
              ))}
            </Pane>
          </Pane>
        )
      }
      return(
          <div>
              <div>
              <>
   
  <Navbar bg="light" variant="dark" shadow>
    <Navbar.Brand href="#home">
      <img
        alt=""
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      SpaceLY Admin
    </Navbar.Brand>
  </Navbar>
</>
              </div>
              <div className="mt-4">
              {SidebarTabsExample()}

              </div>
          </div>
      )    
}
