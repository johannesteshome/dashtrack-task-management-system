import { useLocation } from "react-router-dom";
import { Button } from "antd";
import dashtrack from "../img/dashtrack-banner.png";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { UserVerifyEmail } from "../Redux/features/authActions";
import { useNavigate } from "react-router-dom";
import { AcceptInvitation, GetMyProjects } from "../Redux/features/dataActions";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const notify = (text) => toast(text);

const InvitationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();

  const acceptInvitation = () => {
    dispatch(
      AcceptInvitation({
        email: query.get("email"),
        token: query.get("token"),
        projectId: query.get("id"),
      })
    ).then((res) => {
      if (res.payload.success) {
        notify("You have accepted the invitaion request");
        dispatch(GetMyProjects());
        return navigate("/dashboard");
      }
      else {
        notify(res.payload.message);
      }
    });
  };

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen gap-4'>
      <ToastContainer />
      <img
        src={dashtrack}
        alt='dashtrack Logo'
        className='w-[20%]'
      />
      <h1 className='font-bold text-2xl'>Do you accept the invitaion request?</h1>
      <p>
        You are invited to collaborate on a project.
      </p>
      <Button
        className='bg-blue-500 text-white hover:bg-white hover:text-blue-500'
        onClick={acceptInvitation}>
        Accept
      </Button>
    </div>
  );
};
export default InvitationPage;
