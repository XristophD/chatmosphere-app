import { useConferenceStore } from "../../../store/ConferenceStore";
import { useConnectionStore } from "../../../store/ConnectionStore"
import { useLocalStore } from "../../../store/LocalStore"
import { IconButton } from "../../../components/common/Buttons/Button"
import { useCallback, useState } from "react";
import ScreenShareIcon from "../../../assets/icons/ScreenShare";




// TODO Error when alone in call - not sure why - replaceTrack has some empty object
export const ScreenshareButton = (props) => {

	const jsMeet = useConnectionStore(state => state.jsMeet)
	// const setLocalTracks = useLocalStore(useCallback(store => store.setLocalTracks,[]))
	const replaceLocalTrack = useLocalStore(useCallback(store => store.replaceLocalTrack,[]))
	const conferenceObject = useConferenceStore(state => state.conferenceObject)
	const [isSharing, setIsSharing] = useState(false)


	const setTracks = (tracks) => {
		const newTrack = tracks[0]
		let tmpSharing = false;
		if(newTrack.videoType === 'desktop') {
			tmpSharing = true;
			newTrack.addEventListener(
				window.JitsiMeetJS?.events.track.LOCAL_TRACK_STOPPED,() => createVideoTrack(jsMeet)
			)
		}
		// tracks[0].track.onended = () => console.log("Track onended") //chrome #and firefox getting that event (Safari is not :(
		// tracks[0].track.onmute = () => console.log("Track onmuted") //Safari Event
		// TODO: dkg Reminder
		// FIX: crazy wise this is deleting local audio track but its still delivered and live on the call - why is that? 
		
		const oldTrack = conferenceObject?.getLocalVideoTrack()
		if(oldTrack) {
			conferenceObject?.replaceTrack(oldTrack, newTrack)
			.then(()=>{
				replaceLocalTrack(newTrack)
				setIsSharing(tmpSharing)
				oldTrack.dispose()
			})
		}
	}

		const createDesktopTrack = (jsmeet) => {
			jsmeet.createLocalTracks({ devices: [ 'desktop' ] }) //TODO should happen in store also - just like in LocalVideo
			.then((tracks) => setTracks(tracks))
			.catch(error => {
				console.log("Error Message", error)
			});
		}
		const createVideoTrack = (jsmeet) => {
			jsmeet.createLocalTracks({ devices: [ 'video' ] })
			.then((tracks) => setTracks(tracks))
			.catch(error => {
				console.log(error)
			});
		}
		
		const onClick = () => {
		if(!jsMeet) return
		if(isSharing) {	
			createVideoTrack(jsMeet)
		} else {
			createDesktopTrack(jsMeet)
		}
	}

	return <IconButton round onClick={onClick} IconStart={<ScreenShareIcon />} label="Screenshare" />
}

