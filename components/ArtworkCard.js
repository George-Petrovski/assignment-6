import useSWR from 'swr';
import Link from 'next/link';
import Error from 'next/error';
import { Button, Card } from 'react-bootstrap';

export default function ArtworkCard(props) {
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`);

    if(data == null || data == undefined){
        return null
    }
    else if(error){
        return (<><Error statusCode={404} /></>)
    }
    else{
        return (
            <>
                <Card>
                    {data?.primaryImageSmall ? 
                    <Card.Img variant="top" src={data?.primaryImageSmall} /> :
                    <Card.Img variant="top" src="https://via.placeholder.com/375x375.png?text=%5b+Not+Available+%5d" />
                    }
                    
                    <Card.Body>
                        <Card.Title>{data?.title ? data?.title : 'N\/A'}</Card.Title>
                        <Card.Text>
                            <strong>Date: </strong> {data?.objectDate ? data?.objectDate : 'N\/A'}<br />
                            <strong>Classification: </strong> {data?.classification ? data?.classification : 'N\/A'}<br />
                            <strong>Medium: </strong> {data?.medium ? data?.medium : 'N\/A'}<br /><br />
                        </Card.Text>
                        <Link href={'/artwork/' + props.objectID} passHref legacyBehavior>
                            <Button variant="outline-dark"><strong>ID: </strong>{props.objectID}</Button>
                        </Link>
                    </Card.Body>
                </Card>
            </>
        )
     }
}
