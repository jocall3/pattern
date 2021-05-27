import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { currencyFilter } from '../util';
import { CategoriesChart } from '.';

SpendingInsights.propTypes = {
  transactions: PropTypes.array,
};

export default function SpendingInsights({ transactions }) {
  // grab transactions from most recent month and filter out transfers and payments
  const today = new Date();
  const oneMonthAgo = new Date().setDate(today.getDate() - 30);
  const monthlyTransactions = useMemo(
    () =>
      transactions.filter(tx => {
        const date = new Date(tx.date);
        return (
          date > oneMonthAgo &&
          tx.category !== 'Payment' &&
          tx.category !== 'Transfer'
        );
      }),
    [transactions]
  );

  // create category and name objects from transactions

  const categoriesObject = useMemo(() => {
    return monthlyTransactions.reduce((obj, tx) => {
      tx.category in obj
        ? (obj[tx.category] = tx.amount + obj[tx.category])
        : (obj[tx.category] = tx.amount);
      return obj;
    }, {});
  }, [transactions]);

  const namesObject = useMemo(() => {
    return monthlyTransactions.reduce((obj, tx) => {
      tx.name in obj
        ? (obj[tx.name] = tx.amount + obj[tx.name])
        : (obj[tx.name] = tx.amount);
      return obj;
    }, {});
  }, [transactions]);

  // sort names by spending totals
  const sortedNames = useMemo(() => {
    const namesArray = [];
    for (const name in namesObject) {
      namesArray.push([name, namesObject[name]]);
    }
    namesArray.sort((a, b) => b[1] - a[1]);
    namesArray.splice(5); // top 5
    return namesArray;
  }, [transactions]);

  return (
    <div>
      <h2>Monthly Spending</h2>
      <div className="monthlySpendingContainer">
        <div className="userDataBox">
          <CategoriesChart categories={categoriesObject} />
        </div>
        <div className="userDataBox">
          <div className="holdingsList">
            <h4 className="tableHeading">Top 5 Vendors</h4>
            <div className="data">
              <p className="title">Vendor</p> <p className="title">Amount</p>
              {sortedNames.map(vendor => (
                <>
                  <p>{vendor[0]}</p>
                  <p>{currencyFilter(vendor[1])}</p>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}