import {useState, userContext, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {UseDcontext} from '../components/userInfoContext'; //context to be able to use configurations in our storage room
import ProfileCard from '../components/profileCard';

function Returned(){
    return(
        <>
        <h1>THIS WAS RETURNED</h1>
        </>
    )
}
function ProfileCardForm(){
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const context = UseDcontext();

    const handler = (event)=>{
        let name = event.target.name;
        let value = event.target.value;
        setInputs(prev=>({...prev, [name]:value}));
        context.setInputs(prev=>({...prev, [name]:value}));
    }
    const submit = (event)=>{
        event.preventDefault();
        if (inputs.nameId && inputs.address && inputs.describe){
            navigate('/loading');

            setTimeout(()=>{
                navigate('/ProfileCard');
            }, 5000);
            
        }
        else{
            alert('credentials not complete, pls add all credentials');
        }
    }

    return(
        <div>
            <form onSubmit={submit}>
                <input className="nameInput" type="text" name="nameId" onChange={handler} placeholder="enter your name"></input><br/>
                <input className="nameInput" type="text" name="address" onChange={handler} placeholder="enter your address"></input><br/>
                <input className="nameInput" type="text" name="describe" onChange={handler} placeholder="enter Description"></input>
                <button type="submit">SUBMIT</button>
            </form>
            <Returned/>
            <ProfileCard/>
        </div>
    )
}
export default ProfileCardForm;