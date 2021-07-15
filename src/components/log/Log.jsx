import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Loading } from '../';
import Table from './Table';

const sortByTimestamp = (a, b) => (
  new Date(b.original.createdAt) - new Date(a.original.createdAt)
);

const LOG_HEADERS = [
  {
    Header: 'Timestamp',
    accessor: 'createdAt',
    sortType: sortByTimestamp,
  },
  {
    Header: 'Namespace',
    accessor: 'namespace',
    sortType: 'basic',
  },
  {
    Header: 'Type',
    accessor: 'type',
    sortType: 'basic',
  },
  {
    Header: 'Reason',
    accessor: 'reason',
    sortType: 'basic',
  },
  {
    Header: 'Object',
    accessor: 'object',
    sortType: 'basic',
  },
  {
    Header: 'Message',
    accessor: 'message',
    sortType: 'basic',
  },
  {
    Header: 'Last seen',
    accessor: 'lastSeen',
    disableSortBy: true,
  },
];

const Log = ({ log }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLog, setFilteredLog] = useState(log);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredLog(log);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      const newFilteredLog = log.filter(entry => {
        const values = Object.values(entry);

        for (const value of values) {
          if (typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearchTerm)) {
            return true;
          }
        }

        return false;
      });
      setFilteredLog(newFilteredLog);
    }
  }, [searchTerm]);

  const handleInput = e => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const resetSearch = () => setSearchTerm('');

  let displayComponent;

  if (!log.length) {
    displayComponent = (<Loading resource={'log'} />);
  } else if (!filteredLog.length) {
    displayComponent = (<div>Nothing found in your search; please refine your search</div>);
  } else {
    displayComponent = (
      <Table
        data={filteredLog}
        headers={LOG_HEADERS}
      />
    );
  }

  return (
    <div>
      <div className="section-headers">
        EVENT LOG
      </div>
      <div
        className="sub-header"
        id="log-sub-header"
      >
        Use the Kubiquity event log to find and resolve errors. 
      </div>
      <div>
        <input onChange={handleInput} value={searchTerm} placeholder={'Search the logs'}></input>
        <button onClick={resetSearch}>Reset</button>
      </div>
      {displayComponent}
    </div>
  )
}

Log.propTypes = {
  log: PropTypes.array.isRequired,
};

export default Log;
