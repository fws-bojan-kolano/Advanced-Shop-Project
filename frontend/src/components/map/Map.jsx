import './map.scss';
import "leaflet/dist/leaflet.css";

export default function Map() {
    const { user } = useContext(UserContext);
    console.log(user);

    return (
        <div className="map">         
        </div>
    )
}