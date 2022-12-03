import useSWR from 'swr';
import { useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Error from 'next/error';
import { Row, Col, Pagination, Card } from 'react-bootstrap';
import ArtworkCard from '../../components/ArtworkCard';
import validObjectIDList from '../../public/data/validObjectIDList.json';

const PER_PAGE = 12;

export default function Artwork() {
  const [page, setPage] = useState(1);
  const [artworkList, setArtworkList] = useState();

  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];
  

  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

  function previousPage() {
    if(page > 1)
      setPage(prev => prev - 1);
  }

  function nextPage() {
    if (page < artworkList.length){
      setPage(prev => prev + 1);
    }
  }

  useEffect(() => {
    if (data) {
      let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
      let results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
     
      setArtworkList(results);
    }
    setPage(1);
  }, [data]);
 
  if(error){
    return (<><Error statusCode={404} /></>)
  }
  if(artworkList){
    return (
      <>
        <Row className="gy-4">
          {artworkList.length > 0 ?
            artworkList[page - 1].map(currentObjectID => {
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
        {artworkList.length > 0 && 
        <Row>
          <Col>
              <br />
              <Pagination>
                {page > 1 && <Pagination.Prev onClick={previousPage}/>}
                <Pagination.Item>Page: {page}/{artworkList.length}</Pagination.Item>
                {page < artworkList.length && <Pagination.Next onClick={nextPage}/>}
              </Pagination>
          </Col>
        </Row>
        }
        {
          !artworkList && null 
        }
      </>
    )
  }
}