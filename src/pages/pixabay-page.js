import React from 'react'


const PixabayPage = ({data}) => {

    const photos = data.allPixabayPhoto.edges

    return (
        <div>

            <h1>Hi!</h1>
             {photos.map((photo,i) =>
                
                <img key={i} src={photo.node.largeImageURL}/>
                
                
                
                )}


        </div>

    )


    
}

export default PixabayPage

export const query = graphql`
    query PhotoQuery{
        allPixabayPhoto(limit :10){
            edges{
                node{
                    largeImageURL
                }
            }
        }
    }
`
