import { useState } from 'react';
import { useSelector } from 'react-redux';
import { findPostByName } from '../../common/helpers';
import Form from "react-bootstrap/Form";
import cn from 'classnames';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import './searchbox.css';

function PostSearchBar({ searchQueries, setSearchQueries, children, ...formControlProps }) {
  const [searchActive, setSearchActive] = useState(false);

  const { data } = useSelector((state) => state.posts);
  
  const handleQuery = function(e) {
    const query = e.target.value;
    setSearchQueries({ query, results: findPostByName(data, query)});
  };

  const handleClickAway = () => {
    setSearchActive(false);
  };

  const handleQueryClick = function(e) {
    const query = e.target.textContent;
    setSearchQueries({ query, results: findPostByName(data, query)});
    handleClickAway();
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className='w-100 position-relative'>
        <Form.Control data-testid="field-entry" {...formControlProps} autoComplete='off' value={searchQueries.query} onClick={() => setSearchActive(true)} onChange={(e) => handleQuery(e)} size="lg" type="text" placeholder="Search..." />
        {children}
        <div className={cn("search-box--container", "shadow", "border-bottom", {"d-none": (!searchActive || !searchQueries.query || !searchQueries.results.length)})}>
            {searchQueries.results.length && searchQueries.results.map((val, ind) => 
                <div key={`search-${ind}`} onClick={(e) => handleQueryClick(e)} className="search-box border px-3 py-2">
                    <p>{val.title}</p>
                </div>
            )}
        </div>
      </div>
    </ClickAwayListener>
  )
}
export default PostSearchBar