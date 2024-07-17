import { View, Text} from 'react-native'
import React from 'react'
import PlaceItem from './PlaceItem'

import { FlatList } from 'react-native'

export default function PlaceList({placeList}) {
  return (
    <View>
       <Text
      style={{fontSize:20,fontFamily:'raleway-bold',marginTop:10}}
      >Found {placeList.length} Places</Text>
      <FlatList
      data={placeList}
      renderItem={({item})=>(
        
        
      <PlaceItem place={item} />
      )}
      />
    </View>
  )
}