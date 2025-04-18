import React, { useContext, useEffect, useState} from 'react';
import '../styles/Home.css';
import { AuthContext } from '../context/authContext';
import { SocketContext } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';

import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Groups2Icon from '@mui/icons-material/Groups2';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BoltIcon from '@mui/icons-material/Bolt';

import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';


const Home = () => {
  
  const [roomName, setRoomName] = useState('');
  const [newMeetDate, setNewMeetDate] = useState('none');
  const [newMeetTime, setNewMeetTime] = useState('none');

  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinRoomError, setJoinRoomError] = useState('');
  const {logout} = useContext(AuthContext);
  
  const navigate = useNavigate();
  
  const handleLogIn =() =>{
    navigate('/login');
  }
  
  const handleLogOut =(e)=>{
    e.preventDefault();
    logout();
  }
  
  const {socket, setMyMeets, newMeetType, setNewMeetType} = useContext(SocketContext);

  const userId = localStorage.getItem("userId");
  const userIdString = userId ? userId.toString() : '';

  const handleCreateRoom = () =>{
    socket.emit("create-room", {userId:userIdString, roomName, newMeetType, newMeetDate, newMeetTime});
  }

  const handleJoinRoom = async () =>{
    await socket.emit('user-code-join', {roomId: joinRoomId});
    setRoomName('');
  }

  useEffect(() =>{
    socket.on("room-exists", ({roomId})=>{
      navigate(`/meet/${roomId}`); 

    })
    socket.on("room-not-exist", ()=>{
      setJoinRoomId('');
      setJoinRoomError("Room dosen't exist! please try again..");
    })

    socket.emit("fetch-my-meets", {userId : userIdString});
    socket.on("meets-fetched", async ({myMeets})=>{
      console.log("myMeetsss", myMeets)
      setMyMeets(myMeets);
    })  
  },[socket])

  const userName = localStorage.getItem("userName");
  const userNameString = userName ? userName.toString() : '';

  return (
    <div className='homePage'>
        <div className="homePage-hero">
          <div className="home-header">
              <div className="home-logo">
                <h2 >SyncUp</h2>
              </div>

          {!userNameString || userNameString === '' ? 
          
            <div className="header-before-login">
              <button onClick={handleLogIn}>login</button>
            </div>
          :
            <div className="header-after-login">
              <Dropdown>
                <Dropdown.Toggle  id="dropdown-basic">
                  {userNameString}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item ><Link className='dropdown-options' to='/profile'>Profile</Link></Dropdown.Item>
                  <Dropdown.Item className='dropdown-options' onClick={handleLogOut} >Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
        }
          </div>

          <div className="home-container container">

          {!userNameString || userNameString === '' ? 

            <div className="home-app-intro">
              
              {/* <span className="welcome">Welcome!!</span> */}
              <h2>Limitless <b> Connections: </b> Transform Your Meetings with Free, Next-Generation <b> Video Conferencing!! </b></h2>
              <p>Revolutionize your meetings with our advanced, future-ready video conferencing platform. Enjoy smooth collaboration, crystal-clear audio, and HD video—all at  <b> no-cost..!!</b>  Elevate your virtual communication and connect without limits today!</p>
              <button onClick={handleLogIn}>Join Now..</button>
            </div>
          :
          <>
            <div className="home-app-intro">
                <span className="welcome">Welcome!! {userNameString},</span>
                <h2>Unbounded Connections: Elevate Your Meetings with Free, Future-Forward Video Conferencing!!</h2>
            </div>
            <div className="home-meet-container">
              <div className="create-meet">
                <input type="text" placeholder='Name your meet...' onChange={(e)=> setRoomName(e.target.value)}  />
                <button  data-bs-toggle="modal" data-bs-target="#staticBackdrop"> New meet</button>
              </div>
              <p>or</p>
              <div className="join-meet">
                <input type="text" placeholder='Enter code...' onChange={(e)=> setJoinRoomId(e.target.value)} />
                <button onClick={handleJoinRoom}> Join Meet</button>
              </div>
              <span>{joinRoomError}</span>
            </div>

           {/* Modal */}
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" style={{width: "30vw"}}>
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Create New Meet</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    
                    {/* <input type='text' class="form-control" placeholder='Name your meet' value={roomName} onChange={(e)=> setRoomName(e.target.value)}  /> */}
                    <div class="form-floating mb-3 ">
                      <input type="text" class="form-control" id="floatingInput" placeholder='Name your meet' value={roomName} onChange={(e)=> setRoomName(e.target.value)} />
                      <label htmlFor="floatingInput">Meet name</label>
                    </div>

                    <select class="form-select" aria-label="Default select example" onChange={(e) => setNewMeetType(e.target.value)}>
                      <option  selected>Select Meeting Type</option>
                      <option value="instant">Instant meet</option>
                      <option value="scheduled">Schedule for Later</option>
                    </select>

                    {newMeetType === 'scheduled' ?
                    <>
                    <p style={{margin: " 10px 0px 0px 0px", color: 'rgb(2, 34, 58)'}}>Meet Date: </p>
                    <input type='date' class="form-control" onChange={(e) => setNewMeetDate(e.target.value)} />
                    <p style={{margin: " 10px 0px 0px 0px", color: 'rgb(2, 34, 58)'}}>Meet Time: </p>
                    <input type='time' class="form-control" onChange={(e) => setNewMeetTime(e.target.value)} />
                    </>
                    :
                    ''
                    }

                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onClick={handleCreateRoom} data-bs-dismiss="modal">Create meet</button>
                  </div>
                </div>
              </div>
            </div>
            </>
  }
          </div>
        </div>

        <div className="about-app-container">
          <div class="box">
            <div class="box-inner">
              <div class="box-front">
                <h2>Seamless Connections Anytime, Anywhere!</h2>
                <p>Our video conferencing app connects people with ease and affordability. Experience smooth virtual meetings, effortless collaboration, and stay connected worldwide. Say goodbye to distance and embrace convenience!</p>
              </div> 
              <div class="box-back">
                <h2>Your Gateway to Effortless Communication!</h2>
                <p>Unlock seamless communication with our video conferencing app. Connect effortlessly with colleagues, friends, and family, wherever they are. Say goodbye to pricey travel and hello to convenient, cost-effective meetings.</p>
              </div>
            </div>
          </div>

          <div className="about-cards">
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'><span> <Groups2Icon  /> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Easy Group Conferencing: Bringing clarity and connection to every virtual gathering!!
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'><span> <CalendarMonthIcon /> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Schedule Meet Anytime! Take control of your time, and let your schedule work for you!!
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'> <span> <CurrencyRupeeIcon/> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Free of Charge! Save money and keep your budget happy. Enjoy the perks of no-cost meetings with a virtual high five!!
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'><span> <StopCircleIcon/> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Preserve valuable discussions and insights, allowing you to revisit and learn from every meeting!!
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'><span> <QuestionAnswerIcon /> </span></Card.Title>
                <Card.Text className='about-card-text'>
                In-Meet Chat Feature!! Enable seamless communication within meetings, fostering real-time collaboration and engagement!!
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>

                <Card.Title className='about-card-title'><span> <BoltIcon /> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Navigating virtual space with lightning speed, connecting effortlessly and efficiently, one meeting at a time!!
                </Card.Text>
              </Card.Body>
            </Card>
          </div>

        </div>

        <div className="footer">
          <h2>Contact us @: </h2>
          <div className="footer-social-media">
              <GoogleIcon />
              <FacebookIcon />
              <InstagramIcon />
              <TwitterIcon />
          </div>
        </div>       
    </div>
  )
}

export default Home