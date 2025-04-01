import { FaUser } from 'react-icons/fa';

interface PlayerCardProps {
  name: string;
  tenure: string;
  photoUrl?: string;
  nhlTeam?: string;
}

export const PlayerCard = ({ name, tenure, photoUrl, nhlTeam }: PlayerCardProps) => {
  return (
    <div className='player-card'>
      <div className={`player-photo ${nhlTeam}`}>
        {photoUrl ? (
          <img src={photoUrl} alt={`${name}'s photo`} />
        ) : (
          <FaUser size={40} />
        )}
      </div>
      <div className="player-info">
        <h3 className="player-name">{name}</h3>
        <span className="player-tenure">{tenure !== 'forever' ? `year ${tenure}` : tenure }</span>
        {/* <span className="player-nhl-team">{nhlTeam ? nhlTeam : ''}</span> */}
      </div>
    </div>
  );
}; 