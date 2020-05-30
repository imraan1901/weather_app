import React, {useState} from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import 'react-google-places-autocomplete/dist/index.min.css';
import Weather from "./WeatherInformation5Day";


const SearchAndPassData = () => {

    const [address, setAddress] = useState(`San Francisco, CA, USA`);
    const [latLng, setLatLng] = useState({lat:'37.773972', lng: '-122.431297'});

    async function getLatLng(address){

        let formattedAddress = address.replace(/,/g,'').replace(/ /g, '%20');
        let apiKey = `${process.env.REACT_APP_GOOGLE_KEY}`;
        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${apiKey}`;
        let res = await fetch(url);
        if(res.ok) {
            let data = await res.json();
            let geometry = data.results[0].geometry;
            setLatLng({lat: geometry.location.lat, lng: geometry.location.lng});
        }
        else{
            setLatLng({lat:'', lng: ''});
        }

    }
    return (

        <div>
            <div>
                <GooglePlacesAutocomplete
                    placeholder={'Enter Address or Zip Code'}
                    apiKey={`${process.env.REACT_APP_GOOGLE_KEY}`}
                    onSelect={ ( address ) => {

                        getLatLng(address.description);
                        setAddress(address.description);
                    }}
                    autocompletionRequest={{
                       types: ['(regions)']
                    }}
                />
            </div>
            <h1 className="title">
                5 Day Weather Forecast for {address}
            </h1>
            <div>
                <Weather address={address} latlng={latLng}/>
            </div>
        </div>


    )
};

export default SearchAndPassData;