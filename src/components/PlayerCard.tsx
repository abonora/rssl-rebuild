import { FaUser } from 'react-icons/fa';

interface PlayerCardProps {
  name: string;
  tenure: 'forever' | 'year 1' | 'year 2' | 'year 3';
  photoUrl?: string;
}

export const PlayerCard = ({ name, tenure, photoUrl }: PlayerCardProps) => {
  return (
    <div className="player-card">
      <div className="player-photo">
        {photoUrl ? (
          <img src={photoUrl} alt={`${name}'s photo`} />
        ) : (
          <FaUser size={40} />
        )}
      </div>
      <div className="player-info">
        <h3 className="player-name">{name}</h3>
        <span className="player-tenure">{tenure}</span>
      </div>
    </div>
  );
}; 