
//#region imports
import React, { useRef, useState } from 'react';
import { Box, Typography, TextField, Button, Stack, TextareaAutosize } from '@mui/material';
import {  useSelector , useDispatch } from 'react-redux';
import { createGroup } from '../../../redux/groupSlice';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const AddTeam = ({onClose}) => {
  //#region Component states
  const contentRef = useRef(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const user = useSelector(state => state.auth.user);
  const group = useSelector(store=>store.group);
  console.log('Groups',group.groups);
  console.log('Error',group.error);
  console.log('Loading',group.loading);
  const [teamDetails, setTeamDetails] = useState({
     groupName: '',
     createdBy: user._id,
     description: ''
  })
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();

  
  // const createGroup = useSelector(state => state.group.createGroup);
  //#endregion

  //#region Component hooks
   React.useEffect(() => {
      // Anything in here is fired on component mount.
      const handleClickOutside = (event) => {
        if (contentRef.current && !contentRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
          // Anything in here is fired on component unmount.
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [onClose])

   React.useEffect(() => {
      // Anything in here is fired on component update.
   });
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods

  const handleUserSearch = async () => {
    try {
      console.log(searchQuery)
      const response = await fetch(`http://localhost:3000/profile/user/${searchQuery}`,{
        method: 'GET',
        headers: {
          "Content-type": "application/json"
        },
        credentials: 'include',
      })
      const data = await response.json();
      
      // setGroupMembers(prevMembers => [...prevMembers, data])
      setSearchResults(data.users);
      console.log('Search Results: ',searchResults)
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  //#endregion

  //#region Component feature methods
  const handleTeamInputChange = (e) => {
    try {
      const { name, value } = e.target;
      setTeamDetails(prev => ({
        ...prev,
        [name]: value
      }));
    } catch (error) {
      console.log('Error: ', error)
    }
  };

  

  const handleCreateGroup = async () => {
    if (!teamDetails.groupName.trim() || !teamDetails.description.trim()) {
    alert('Please fill in all required fields (Group Name and Description)');
    return;
  }
    const finalGroupDetails = {
      ...teamDetails,
      members: groupMembers.map(member => member._id),
    };
    // console.log('Group Created:', finalGroupDetails)

    
  try {
    await dispatch(createGroup(finalGroupDetails)).unwrap();
    console.log('Group created successfully!');
     
  } catch (error) {
    console.error('Error creating group:', error);
  } finally {
    onClose();
  }
  };
  //#endregion

  //#region Component JSX.members

  //#endregion

  //#region Component renders
  return(
    <Box
        ref={contentRef}
      sx={{
        position: 'fixed',
        top: '13vh',
        left: '50vh',
        width: '60vw',
        height: '86vh',
        backgroundColor: '#F9F9F9',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        padding: 3,
        // boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        boxShadow: 3,
      }}
    >
      <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
      <Typography variant="h6" gutterBottom >
        <Box component="span"
        sx={{ 
            textDecoration: 'underline', 
            textDecorationColor: '#F24E1E', 
        }}
        >Create</Box> 
         <Box component="span"> New Team</Box>
      </Typography>
      <Button onClick={()=>onClose()} sx={{textDecoration:'underline'}}>Go BACk</Button>
      </Box>

      <Box 
        sx={{
           backgroundColor: '#FFF',
           width: '100%',
           height: '90vh',
           p: '1rem',
           display: 'flex',
           flexDirection: 'column',
           overflow: 'auto',
           boxShadow: 3,
           borderRadius: 1
           
        }}>
        <TextField 
          label="Group Name" 
          name="groupName" 
          value={teamDetails.groupName} 
          onChange={handleTeamInputChange} 
          placeholder='Enter Group Name' 
          variant="outlined"  
          type='text' 
          fullWidth
          size='small'
        />
        <TextField
          label="CreatedBy"
          name="createdBy"
          disabled
          value={user.firstName + ' ' + user.lastName}
          variant="outlined"
          size="small"
          type="email"
          fullWidth
          sx={{ marginTop: 2 }}
        />
        {
          groupMembers.length>0 && 
          <Stack sx={{margin: '0.9rem 0 0.4rem 0', color: '#FFF', display: 'flex', flexWrap: 'wrap'}} direction="row" >
            {groupMembers.map(member =>(
              <>
                <Box component="span" sx={{display: 'flex', gap: 0.6, backgroundColor: '#F24E1E', borderRadius: 0.5, padding: '1px 2px', margin: '2px'}}>{member.firstName}<Box component="span" sx={{cursor: 'pointer', padding: '1px 2px', fontWeight: 'bold', color: '#000'}}>X</Box></Box>
              </>
            ))}
          </Stack>
        }
        <Box sx={{display: 'flex',  width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
          <Box sx={{width:'85%', display: 'flex', position: 'relative'}}>
            <TextField 
              label="Add members" 
              size='small' 
              variant='outlined' 
              name='searchQuery'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              type='text' 
              fullWidth 
              sx={{mt: 2}}
            />
            {searchResults.length > 0 && (
              <Box  sx={{ 
                background: '#fff', 
                borderRadius: 1, 
                boxShadow: 3, 
                maxHeight: 200, 
                overflowY: 'auto',
                position: 'absolute',
                top: '40px',
                zIndex: 10,
                width: '100%',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                }}>
                {searchResults.map((user , index) => (
                  <Box 
                    key={index}
                    onClick={() =>{
                      setSearchResults([]);
                      setGroupMembers(prevMembers => [...prevMembers, user]);
                      setSelectedUsers(prev=> [...prev, user._id]);
                      console.log('Selected Users: ', selectedUsers);
                    }}
                    sx={{ 
                      px: 2, 
                      py: 1, 
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #ddd',
                      cursor: 'pointer', 
                      '&:hover': { background: '#f4f4f4' } 
                    }}
                  > 
                  <Typography>
                      {user.firstName} { user.lastName}
                  </Typography>
                  <Typography>{user.email} </Typography>
                     
                  </Box>
                ))}
              </Box>
            )
          }
          </Box>
        <Button 
            variant="contained" 
            sx={{backgroundColor: '#F24E1E' , mt: 2, }} 

            onClick={handleUserSearch}
          >
            Search
        </Button>
          </Box>

        <TextField
          label="Group Description"
          name='description'
          value={teamDetails.description}
          onChange={handleTeamInputChange}
          multiline
          size='small'
          rows={3}
          fullWidth
          variant="outlined"
          placeholder="Enter Group Description here..."
          sx={{marginY: '1rem'}}
        />

        <Button 
          variant="contained" 
          size="large" 
          sx={{ backgroundColor: '#F24E1E'}} 
          onClick={handleCreateGroup}
        >
          Create Group
        </Button>
      </Box>
      
    </Box>
  );
  //#endregion
}
//#endregion

//#region Component export
export default AddTeam;
//#endregion