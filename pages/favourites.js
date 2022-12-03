import { Row, Col, Card } from 'react-bootstrap';
import ArtworkCard from '../components/ArtworkCard';
import { useAtom } from 'jotai'
import { favouritesAtom } from '../store.js'

export default function Favourites() {
  const [ favouritesList, setFavouritesList ] = useAtom(favouritesAtom);

  if(!favouritesList) return null;
    
  if(favouritesList){
    return (
      <>
        <Row className="gy-4">
          {favouritesList.length > 0 ?
            favouritesList.map(currentObjectID => {
              return (
                <Col lg={3} key={currentObjectID}><ArtworkCard objectID={currentObjectID} /></Col>
              )
            })
            :
            <Card>
              <Card.Body>
                <Card.Text>
                  <h4><strong>Nothing Here</strong></h4><br />
                  Try searching for something else.
                </Card.Text>
              </Card.Body>
            </Card>
          }
        </Row>
      </>
    )
  }
}