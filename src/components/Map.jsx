import { useRef, useState } from 'react'
import { useJsApiLoader, GoogleMap, Autocomplete, Marker } from '@react-google-maps/api'
import Loading from './Loading'
import LoadingFailed from './LoadingFailed'

const KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const containerStyle = {
   width: '100%',
   height: '100vh',
}

const center = {
   lat: -3.745,
   lng: -38.523,
}
const libraries = ['places']

const Map = () => {
   let searchBoxRef = useRef()
   const [location, setLocation] = useState()
   const [searchBox, setSearchBox] = useState()

   const { isLoaded, loadError } = useJsApiLoader({
      googleMapsApiKey: KEY,
      libraries,
   })

   const onLoad = _searchBox => {
      searchBoxRef = _searchBox
      setSearchBox(_searchBox)
   }

   const onPlaceChanged = () => {
      searchBoxRef = searchBox
      const { geometry } = searchBoxRef.getPlace()
      setLocation({ lat: geometry?.location?.lat(), lng: geometry?.location?.lng() })
   }

   const renderMap = () => {
      return (
         <GoogleMap
            center={location === undefined ? center : location}
            mapContainerStyle={containerStyle}
            zoom={12}
         >
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
               <input
                  type="text"
                  placeholder="Search location..."
                  ref={searchBoxRef}
                  style={{
                     boxSizing: `border-box`,
                     border: `1px solid transparent`,
                     width: `240px`,
                     height: `32px`,
                     padding: `0 12px`,
                     borderRadius: `3px`,
                     boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                     fontSize: `14px`,
                     outline: `none`,
                     textOverflow: `ellipses`,
                     position: 'absolute',
                     left: '50%',
                     marginLeft: '-120px',
                  }}
               />
            </Autocomplete>
            <Marker position={location} />
         </GoogleMap>
      )
   }

   if (loadError) {
      return <LoadingFailed />
   }

   return isLoaded ? renderMap() : <Loading />
}

export default Map
