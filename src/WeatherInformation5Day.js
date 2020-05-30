import React, {useState, useEffect} from 'react';
import firebase from 'firebase';

const Weather = (props) => {
    const [weatherDescription, setWeatherDescription] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFound, setIsFound] = useState(false);

    const handleNotFound = () => {
        setWeatherDescription({day:'Weather not found, please pick another valid place.',temp:70,picture:null});
        setIsLoading(false);
        setIsFound(false);
    };

    function get24Hour(UNIX_timestamp) {
        let a = new Date(UNIX_timestamp * 1000);
        return a.getHours();
    }

    function timeConverter(UNIX_timestamp){
        let a = new Date(UNIX_timestamp * 1000);
        let months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
        let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        let month = months[a.getMonth()];
        let date = a.getDate();
        let day = days[a.getDay()];
        let hour = a.getHours();
        let AmOrPm = '';

        if(hour > 12) {
            hour = hour%12;
            AmOrPm = 'PM';
        }
        else {
            AmOrPm = 'AM';
        }

        return [`${hour} ${AmOrPm}`, `${day}`, `${month} ${date}`];
    }



    async function fetchData() {

        let apiKey = `${process.env.REACT_APP_WEATHER_KEY}`;
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${props.latlng.lat}&lon=${props.latlng.lng}&appid=${apiKey}&units=imperial`;
        let res = await fetch(url);

        if (res.ok) {

            // use this api https://openweathermap.org/forecast5
            let json = await res.json();
            let dataList = json.list;

            let tempDescription = dataList.map( async (info, i) => {

                let dataURL = `gs://weather-app-278002.appspot.com/${info.weather[0].icon}@2x.png`;

                let iconURL = await firebase
                    .storage()
                    .refFromURL(dataURL)
                    .getDownloadURL();

                let hour24 = get24Hour(info.dt);
                let time = timeConverter(info.dt);


                if(hour24 >= 8 && hour24 <= 24) {

                    return (
                        {
                            day: time[1],
                            hour: time[0],
                            date: time[2],
                            icon: info.weather[0].icon,
                            temp: info.main.temp,
                            description: info.weather[0].description,
                            picture: iconURL
                        }
                    )
                } else {
                    return null;
                }

            });


            Promise.all(tempDescription).then((values) => {
                setWeatherDescription(values);
            });
            setIsLoading(false);
            setIsFound(true);
        }
        else {
            handleNotFound();
        }
    }

    useEffect(() => {
        fetchData();
    },[props.latlng]);

    function cityFound() {

        let foundNextDay = false;
        let count = 0;
        let arr = [];
        let whichBox = '';
        let titleFlag = false;

        return (
            <div>
                <h3 className='container'>

                    {
                        weatherDescription.map( (day) => {

                            if (day == null) {
                                return
                            }

                            let box = '';
                            let rainyDayCodes = ['09d', '09n', '10d', '10n', '11d,', '11n'];

                            if (day.temp >= 100) {

                                box = 'reallyHotDay'
                            } else if (day.temp >= 90) {

                                box = 'hotDay'
                            } else if (rainyDayCodes.includes(day.icon)) {

                                box = 'rainyDay'
                            } else {

                                box = 'normalDay'
                            }

                            if (day.hour === '8 AM') {
                                foundNextDay = true;
                                titleFlag = true;
                                whichBox = 'topBox'

                            } else if(day.hour === '11 PM') {
                                titleFlag = false;
                                whichBox = 'botBox'
                            } else {
                                titleFlag = false;
                                whichBox = 'midBox'
                            }

                            if(foundNextDay) {

                                return (

                                <div>

                                    {titleFlag ? (
                                        <div>
                                            <h3 className={'subTitle'}>
                                                {`${day.day}\n${day.date}`}

                                            </h3>
                                        </div>
                                    ) : null}

                                        <div className={whichBox}>
                                            <div className={box}>
                                                <div>
                                                    {day.hour}
                                                </div>
                                                <div>
                                                    {day.temp.toFixed(1)}° F
                                                </div>
                                                <div>
                                                    {day.description}
                                                </div>
                                                <div>
                                                    <img src={day.picture} alt={''}/>
                                                </div>
                                            </div>
                                        </div>
                                </div>

                                )
                            } else {
                                count = count + 1;
                                arr.push([count * 3, whichBox]);
                                return null
                            }

                        })

                    }

                    {arr.map((time) => {

                            return (
                            <div className={time[1]}>
                                <div className={'normalDay'}>
                                    Available in {time[0]} hours
                                </div>
                            </div>
                            )
                        }
                    )}

                </h3>
            </div>
        )
    }

    function cityNotFound() {

        return(
            <div>
                <h3 className={'subTitle'}>
                    {weatherDescription.day}
                </h3>
            </div>
        )
    }

    return (
        <div>
            {
            isLoading ? (<div>loading...</div>) :

                isFound ? cityFound() : cityNotFound()

            }
        </div>
    );

};
export default Weather;