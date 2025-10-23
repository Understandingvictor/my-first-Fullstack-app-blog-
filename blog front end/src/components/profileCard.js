import { UseDcontext} from "./userInfoContext";
function ProfileCard({name, adress, description}){
    const context = UseDcontext();
    return(
        <div>
            <label>Name</label>
            <h1>{context.inputs.nameId}</h1>

            <label>Address</label>
            <p>{context.inputs.address}</p>

            <label>Description</label>
            <p>{context.inputs.description}</p>

        </div>
    )
}
export default ProfileCard;