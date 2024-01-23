import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem';
import axios from 'axios';

function Favourites() {
    const [loadingH, setLoadingH] = useState(false);
    const [errorH, setErrorH] = useState(false);
    const [favs, setFavs] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingH(true);
                const user = JSON.parse(localStorage.getItem('proUser'));
                const response = await axios.post('http://localhost:8080/api/getFav', {userId: user._id});
               // console.log(response)
                if (response.data.status === 'ok') {
                    setFavs(response.data.data);
                    setLoadingH(false);
                    setErrorH(false);
                } else {
                    setLoadingH(false);
                    setErrorH(true);
                }
            } catch (error) {
                setErrorH(true);
            }
        };

        fetchData(); // Call the async function immediately

    }, []); // Empty dependency array for initial run only

    if (loadingH) {
        return <h1>Loading...</h1>
    }

    if (errorH) {
        return <h1>Couldn't fetch favorites</h1>
    }

    return (<>
<h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>Favourite News</h1>
         
        <div className="container">
        <div className="row">
            {
                favs ?
                favs.map((item) =>{

                    return <div className="col-md-4" key={item.url}>
                
                    <NewsItem
                        key={item._id}
                        title={item.title}
                        description={item.description}
                        imageUrl={item.imageUrl}
                        newsUrl={item.newsUrl}
                        author={item.author}
                        date={item.date}
                        source={item.source}
                    />
                    </div>
                })
                : 
                <h1>No Favourites Yet !!!</h1>
            }

</div>
        </div>
        </>
    )
}

export default Favourites