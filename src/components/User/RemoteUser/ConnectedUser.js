import { useCallback, useEffect, useRef } from 'react';
import { useConferenceStore } from '../../../store/ConferenceStore';
import { UserBackdrop } from '../components/Backdrop/UserBackdrop';
import { AudioTrack } from './AudioTrack';
import { MuteIndicator } from './MuteIndicator';
import { VideoContainer, VideoTrack } from "./VideoTrack"
import { NameTag } from '../../NameTag/NameTag';
import { useLocalStore } from '../../../store/LocalStore';
import { DesktopVideo } from './DesktopVideo';


export const ConnectedUser = ({id}) => {

  const myPos = useConferenceStore(useCallback(store => store.users[id]['pos'], [id]))
  const myVolume = useConferenceStore(useCallback(store => store.users[id]['volume'], [id]))
  const isMute = useConferenceStore(useCallback(store => store.users[id]['mute'],[id]))
  const calculateVolume = useConferenceStore(useCallback(store => store.calculateVolume, []))
  const calculateUserInRadius = useLocalStore(useCallback((store) => store.calculateUserInRadius,[]))
  const calculateUserOnScreen = useLocalStore(useCallback((store) => store.calculateUserOnScreen,[]))
  const user = useConferenceStore(useCallback(store => store.users[id], [id]))
  const videoType = useConferenceStore(store => store.users[id]?.['video']?.['videoType']) // FIXME maybe thats why there is a red square????
  const isOnStage = user.properties?.onStage
  const myRef = useRef()

  useEffect(() => {
    calculateVolume(id)
    calculateUserInRadius(id)
    calculateUserOnScreen(user, myRef.current)
  },[id, calculateVolume, calculateUserInRadius, calculateUserOnScreen, user, myPos])

  return(
    <div style={{position:'absolute', width:"200px", height:"200px", left:`${myPos.x}px`, top:`${myPos.y}px`}} id={id} className="userContainer" ref={myRef} >
      <VideoContainer>
        {isOnStage && 
          <UserBackdrop onStage>Currently on Stage</UserBackdrop>
        }
        {!isOnStage && 
          <>
            <UserBackdrop>Maybe try a reload</UserBackdrop>
            {(videoType !== 'desktop') && <VideoTrack id={id} />}
            {(videoType === 'desktop') && <DesktopVideo user={user} />}
          </>
        }
      </VideoContainer>
      <AudioTrack id={id} volume={myVolume} />
      <NameTag>{user?.user?._displayName || 'Friendly Sphere'}</NameTag>
      <div>Volume {Math.round(myVolume * 11)}</div>
      {isMute && <MuteIndicator />}
    </div>
  )
}

export default ConnectedUser