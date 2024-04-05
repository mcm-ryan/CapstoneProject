import "./Login.css";
import userIcon from "../Assets/userIcon.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import recordingIcon from "../Assets/recording.png";
import stopRecordingIcon from "../Assets/stopRecording.png"
const SignUp = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState(0);
  const [isRecording, setRecording] = useState(false);
  return (
    <div className="wrapper fadeInDown">
      {steps === 0 && (
        <div id="formContent">
          {/* <!-- Tabs Titles --> */}
          <h2 className="inactive" onClick={() => navigate("/login")}>
            {" "}
            Sign In{" "}
          </h2>
          <h2 className="active underlineHover">Sign Up </h2>

          {/* <!-- Icon --> */}
          <div className="fadeIn first">
            <img
              src={userIcon}
              id="icon"
              alt="User Icon"
              className="userIcon"
            />
          </div>

          {/* <!-- Login Form --> */}
          <h2>Welcome!! Let's get you started </h2>
          <div>
            {" "}
            First we are gonna need some sample of your voice. Whenever you are
            ready, click on the recording button and read the short story below
            from top to bottom
          </div>
          <div className="short-story-wrapper">
            <div className="short-story-text">
              Title: The Forgotten Note In the quaint town of Willow Creek,
              there was a hidden treasure, the old Willow Inn. Its walls echoed
              with the laughter of bygone days. One stormy evening, young Lily
              stumbled upon the inn while seeking shelter. Inside, she
              discovered a dusty piano. Curious, she brushed off the keys and
              played a haunting melody. Suddenly, a hidden compartment revealed
              an old, yellowed note. It spoke of lost love and shattered dreams.
              As Lily read, she felt a pang of empathy for the writer's sorrow.
              Determined to bring closure, she set out to find the author.
              Through winding alleys and forgotten memories, Lily uncovered the
              writer's identity – an elderly man named Henry. Tears welled in
              his eyes as Lily handed him the note. It was a love letter he had
              written decades ago but never sent. With trembling hands, Henry
              read his own words, and in that moment, he found peace. As the
              storm cleared, Lily left the inn, leaving behind a legacy of
              healing and forgiveness.
            </div>
          </div>
          <form>
            <input
              type="text"
              id="login"
              className="fadeIn second"
              name="login"
              placeholder="username"
            />
            <div>
              {isRecording === false && <img
                className="recording"
                src={recordingIcon}
                alt="Recording Icon"
                onClick={()=> setRecording(!isRecording)}
              />}
              {isRecording === true && <img
                className="recording"
                src={stopRecordingIcon}
                alt="Stop recording Icon"
                onClick={()=> setRecording(!isRecording)}

              />}
            </div>
            <input type="submit" className="fadeIn fourth" value="Sign Up" />
          </form>

          {/* <!-- Remind Passowrd --> */}
          <div id="formFooter">
            <a className="underlineHover" href="#">
              Forgot Password?
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
export default SignUp;