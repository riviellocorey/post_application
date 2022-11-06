import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EditModal from './EditModal';
import PostCard from './PostCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import PostSearchBar from './PostSearchBar';


function PostSection() {
  const { data, status } = useSelector((state) => state.posts);
  const [searchedData, setSearchedData] = useState([]);
  const [searchContainsMore, setSearchContainsMore] = useState(true);
  const [indexQuery, setIndexQuery] = useState({ query: "", results: [] });


  const handleSearchAdd = (query) => {
    if (searchedData.length === query.length) setSearchContainsMore(false);
      if (searchedData.length + 10 > query.length) {
        setSearchedData(prev => [...prev, ...query.slice(searchedData.length, query.length)])
      } else {
        setSearchedData(prev => [...prev, ...query.slice(searchedData.length, searchedData.length + 10)]);
      };
  };

  const handleFetchLazy = () => {
    setTimeout(() => {
      if (indexQuery.results.length) {
        handleSearchAdd(indexQuery.results);
      }
      if (!indexQuery.results.length) {
        handleSearchAdd(data);
      }
    }, [500])
  }

  // Slice Original Lazy Data for Posts & Queried Data
  useEffect(() => {
    if (indexQuery.results.length) setSearchedData([...indexQuery.results.slice(0, 10)]);
    if (!indexQuery.results.length) setSearchedData([...data.slice(0, 10)]);
    setSearchContainsMore(true);
  }, [indexQuery, data]);

  useEffect(() => {
    setIndexQuery({ query: "", results: []});
  }, [data])


  return (
    <Container className='my-3 justify-content-center position-relative'>
        {searchedData.length ? 
        <>
          <div className="d-flex justify-content-center">
            <div style={{ maxWidth: '100%', width: "45rem" }} className="position-relative search-box--wrapper">
              <div className="position-relative">
                  <PostSearchBar searchQueries={indexQuery} setSearchQueries={setIndexQuery}/>
              </div>
            </div>
          </div>
          <div className="my-4 w-100 d-flex justify-content-center">
            <div className="d-flex justify-content-start" style={{ maxWidth: '100%', width: "45rem" }}>
              <EditModal></EditModal>
            </div>
          </div>

          {status === "loading" && <div className="text-center"><Spinner className="mx-5" animation="border"></Spinner></div>}

          <div data-testid="posts-frontpage" className="d-flex justify-content-center">
              <InfiniteScroll 
              loader={
              <div className='d-flex align-items-center'>
                <h4 className="pe-3">Loading</h4>
                <Spinner animation="border"></Spinner>
              </div>} 
              style={{ maxWidth: "100%", width: "45rem", overflow: "hidden" }} 
              scrollThreshold={1} 
              dataLength={searchedData.length} 
              hasMore={searchContainsMore} 
              next={handleFetchLazy}
              >
                {searchedData.map((val, index) => <PostCard key={`post-${index}`} post={val} index={index}></PostCard>)}
              </InfiniteScroll>
          </div>
        </>
        : ""}
    </Container>
  )
}
export default PostSection