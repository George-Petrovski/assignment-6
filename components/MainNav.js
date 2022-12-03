import { Container, Nav, Navbar, NavDropdown, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useState} from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store.js';
import { addToHistory } from '../lib/userData';
import { readToken, removeToken } from '../lib/authenticate';

export default function MainNav() {
   const router = useRouter()
   const [expanded, setExpanded] = useState(false)

   const [route, setRoute] = useState()

   const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

   async function handleSubmit(e){
       e.preventDefault()
       router.push(`/artwork?title=true&q=${route}`)
       setSearchHistory(await addToHistory(`title=true&q=${route}`));
   }

  let token = readToken();

  function logout(){
      setExpanded(false);
      removeToken();
      router.push(`/login`);
  }
 
    return (
     <>
      <Navbar expanded={expanded} className="fixed-top navbar-dark" bg="dark" expand="lg"><Container>
            <Navbar.Brand>George Petrovski</Navbar.Brand>
            <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">
                    <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} onClick={() => setExpanded(false)}>Home</Nav.Link></Link>
                    {token && <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} onClick={() => setExpanded(false)}>Advanced Search</Nav.Link></Link>}
                  
               </Nav>
               {token &&
               <Form className="d-flex" onSubmit={handleSubmit}>
                    <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => {setRoute(e.target.value)}}
                    />
                    <Button onClick={() => setExpanded(false)} type="submit" variant="success">Search</Button>
                </Form>}
                
                  {token ?
                    <Nav>
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                    <NavDropdown title={token.userName} id="basic-nav-dropdown">
                      <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item active={router.pathname === "/favourites"} onClick={() => setExpanded(false)}>Favourites</NavDropdown.Item></Link>
                      <Link href="/history" passHref legacyBehavior><NavDropdown.Item active={router.pathname === "/history"} onClick={() => setExpanded(false)}>Search History</NavDropdown.Item></Link>
                    </NavDropdown>
                    </Nav>
                  : <Nav>
                    <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} onClick={() => setExpanded(false)}>Register</Nav.Link></Link> 
                    <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} onClick={() => setExpanded(false)}>Log In</Nav.Link></Link>
                  </Nav>
                  }    
                
            </Navbar.Collapse>
         </Container>
      </Navbar>
      <br />
      <br />
     </>
    )
  }