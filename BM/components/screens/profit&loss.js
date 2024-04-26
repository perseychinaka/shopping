import React, { useState, useEffect } from 'react';
import { Text, TextInput, FlatList, View, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { useIsFocused } from "@react-navigation/native";
import moment from 'moment';
import * as DB from './database';
const db = DB.db;
export const ProfitandLoss = ({ navigation }) => {
  const [sales, setsales] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [openingstock, setopeningstock] = useState(0);
  const [CostOfGoodsSold, setCostOfGoodsSold] = useState(0);
  const [ClosingStock, setClosingStock] = useState(0);
  const [date, setDate] = useState(new Date());
  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  useEffect(
    () => {
      DB.updateclosingstock().then(() => getnetsales())
    }, [{}, isFocused]);

  const getnetsales = (dat) => {
    let openingdate = moment(dat).startOf('month').format('DD MMMM YYYY');
    let closingdate = moment(dat).endOf('month').format('DD MMMM YYYY');
    let netincome = 0;
    let netexpenses = 0;
    let netsales = 0;
    let nopeningstock = 0;
    let nclosingstock = 0;
    let newstock = 0;
    db.transaction((tx) => {
      // alert('got here');
       tx.executeSql(
        'SELECT value FROM operation WHERE type="closing stock" And date LIKE "%' + closingdate + '%" ORDER BY id DESC LIMIT 1',
        [],
        (_, { rows }) => {
          // alert(rows.length);
          if (rows.length > 0) {
            nclosingstock = rows.item(0).value.toFixed(2);
            setClosingStock(nclosingstock);
          } else setClosingStock(0);
        }
      );
      tx.executeSql(
        'SELECT value FROM operation WHERE type="Opening stock" And date LIKE "%' + openingdate + '%"',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            nopeningstock = rows.item(0).value.toFixed(2);
            // alert(rows.length);
            setopeningstock(nopeningstock);
          } else setopeningstock(0);
        }
      );
      tx.executeSql(
        'SELECT total FROM orders inner join activitylog on activityId= activitylog.id WHERE  date  LIKE "%' + moment(dat).format('MMMM YYYY') + '%"',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            let rws = []
            for (let i = 0; i < rows.length; i++) {
              let row = rows.item(i);
              rws.push(row);
            }
            newstock = rws.reduce((prev, { total }) => {
              return prev + total;
            }, 0);

            setPurchases(newstock.toFixed(2));
          } else setPurchases(0);
        }, e => alert(JSON.stringify(e))
      );
      tx.executeSql(
        'SELECT total FROM receipt where  time  LIKE "%' + moment(dat).format('MMMM YYYY') + '%"',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            let rws = []
            for (let i = 0; i < rows.length; i++) {
              let row = rows.item(i);
              rws.push(row);
            }
            netsales = rws.reduce((prev, { total }) => {
              return prev + parseFloat(total);
            }, 0);
            // alert(netsales+JSON.stringify(rws));
            setsales(netsales);
          } else setsales(0);
        }, e => alert(JSON.stringify(e))
      );
      tx.executeSql(
        'SELECT value FROM operation WHERE type="Expense" and date  LIKE "%' + moment(dat).format('MMMM YYYY') + '%"',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            let rws = []
            for (let i = 0; i < rows.length; i++) {
              let row = rows.item(i);
              rws.push(row);
            }
            netexpenses = rws.reduce((prev, { value }) => {
              return prev + parseFloat(value);
            }, 0);
            // alert(JSON.stringify(rws));
            setExpenses(netexpenses);
          } else setExpenses(0);
        }, e => alert(JSON.stringify(e))
      );
      tx.executeSql(
        'SELECT value FROM operation WHERE type="Income" and date  LIKE "%' + moment(dat).format('MMMM YYYY') + '%"',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            let rws = []
            for (let i = 0; i < rows.length; i++) {
              let row = rows.item(i);
              rws.push(row);
            }
            netincome = rws.reduce((prev, { value }) => {
              return prev + parseFloat(value);
            }, 0);
            // alert(JSON.stringify(rws));
            setIncome(netincome);
          } else setIncome(0);
        }, e => alert(JSON.stringify(e))
      );
    });
    let costofgoodssold = (
      parseFloat(openingstock) +
      parseFloat(purchases) -
      parseFloat(ClosingStock)
    ).toFixed(2);
    setCostOfGoodsSold(costofgoodssold);
  };

  const subtract = () => {
    let d = moment(date).subtract(1, 'months');
    setDate(d);
    return getnetsales(d);
  };
  const add = () => {
    if (date < moment(new Date())) {
      let d = moment(date).add(1, 'months');
      setDate(d);
      return getnetsales(d);
    }
  };
  const MonthPiCker = () => {
    return (
      <View style={styles.container}>
        <View style={styles.flexRow}>
          <View>
            <Text
              style={{
                fontSize: 17,
                fontWeight: 'bold', color: 'grey'
              }}
            >
              Profit and Loss account for the month ending {" \n"}
              {moment(date).endOf('month').format('DD MMMM YYYY')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={(styles.flexcontainer, { flex: 1 })}>
      <View>
        {/* Description details */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <FlatList ListHeaderComponent={<MonthPiCker />} />
        </View>
        {/* heading Details */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={styles.heading}
          >
            Details
          </Text>
          <Text
            style={styles.heading}
          >
            DR
          </Text>
          <Text
            style={styles.heading}
          >
            CR
          </Text>
        </View>
        {/* Net Sales */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flex: 1,
              color: 'grey', fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Net Sales
          </Text>
          <Text
            style={{
              flex: 1,
              alignSelf: 'center',
            }}
          ></Text>
          <Text
            style={{
              flex: 1,
              color: 'grey', alignSelf: 'center',
            }}
          >
            {parseFloat(sales).toFixed(2)}
          </Text>
        </View>
        {/*  Opening stock */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flex: 1,
              color: 'grey', fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Opening stock
          </Text>
          <Text
            style={{
              paddingLeft: 5,
              flex: 0.5,
              color: 'grey', textAlign: 'center',
            }}
          >
            {parseFloat(openingstock).toFixed(2)}
          </Text>
          <Text
            style={{
              flex: 1,
            }}
          ></Text>
        </View>
        {/* Net purchases */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flex: 1,
              color: 'grey', fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Net purchases
          </Text>
          <Text
            style={{
              paddingLeft: 5,
              color: 'grey', flex: 0.5,
              textAlign: 'center',
            }}
          >
            {parseFloat(purchases).toFixed(2)}
          </Text>
          <Text
            style={{
              flex: 1,
            }}
          ></Text>
        </View>
        {/* Closing stock */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flex: 1,
              color: 'grey', fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Closing stock
          </Text>
          <Text
            style={{
              color: 'grey', paddingLeft: 5,
              flex: 0.5,
              textAlign: 'center',
            }}
          >
            {parseFloat(ClosingStock).toFixed(2)}
          </Text>
          <Text
            style={{
              flex: 1,
            }}
          ></Text>
        </View>
        {/* Cost of goods sold */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flex: 1,
              color: 'grey', fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Cost of goods sold
          </Text>
          {(
            parseFloat(openingstock) +
            parseFloat(purchases) -
            parseFloat(ClosingStock)
          ).toFixed(2) > 0 && (
              <Text
                style={{
                  paddingLeft: 5,
                  color: 'grey', flex: 0.5,
                  textAlign: 'center',
                  borderTopWidth: 1,
                  borderColor: 'blue',
                }}
              >
                {(
                  parseFloat(openingstock) +
                  parseFloat(purchases) -
                  parseFloat(ClosingStock)
                ).toFixed(2)}
              </Text>
            )}
          {(
            parseFloat(openingstock) +
            parseFloat(purchases) -
            parseFloat(ClosingStock)
          ).toFixed(2) <= 0 && (
              <Text
                style={{
                  paddingLeft: 5,
                  color: 'grey', flex: 0.5,
                  textAlign: 'center',
                  borderTopWidth: 1,
                  borderColor: 'blue',
                }}
              >
                0.00
              </Text>
            )}
          <Text
            style={{
              flex: 1,
            }}
          ></Text>
        </View>
        {/* Gross profit */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flex: 1,
              color: 'grey', fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Gross profit
          </Text>
          {parseFloat(openingstock) + parseFloat(purchases) > 0 && (
            <Text
              style={{
                paddingLeft: 5,
                flex: 1.5, color: 'grey',
                textAlign: 'center',
                borderTopWidth: 1,
                borderColor: 'blue',
              }}
            >
              {(
                parseFloat(sales) -
                (parseFloat(openingstock) +
                  parseFloat(purchases) -
                  parseFloat(ClosingStock))
              ).toFixed(2)}
            </Text>
          )}
          {parseFloat(openingstock) + parseFloat(purchases) == 0 && (
            <Text
              style={{
                paddingLeft: 5,
                flex: 1.5,
                textAlign: 'center',
                borderTopWidth: 1,
                borderColor: 'blue', color: 'grey',
              }}
            >
              {parseFloat(openingstock).toFixed(2)}
            </Text>
          )}
        </View>
        {/* Expenses */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flex: 1,
              color: 'grey', fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Expenses
          </Text>
          <Text
            style={{
              paddingLeft: 5,
              flex: 0.5,
              textAlign: 'center', color: 'grey',
            }}
          >
            {parseFloat(expenses).toFixed(2)}
          </Text>
          <Text
            style={{
              flex: 1,
            }}
          ></Text>
        </View>
        {/* Other incomes */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flex: 1,
              color: 'grey', fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Other incomes
          </Text>
          <Text
            style={{
              paddingLeft: 5, color: 'grey',
              flex: 0.5,
              textAlign: 'center',
            }}
          >
            {parseFloat(income).toFixed(2)}
          </Text>
          <Text
            style={{
              flex: 1,
            }}
          ></Text>
        </View>
        {/* net profit or loss */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            marginHorizontal: 5,
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          {parseFloat(sales) -
            (parseFloat(openingstock) +
              parseFloat(purchases) -
              parseFloat(ClosingStock)) +
            income -
            parseFloat(expenses) >=
            0 && (
              <Text
                style={{
                  flex: 1,
                  fontWeight: 'bold',
                  alignSelf: 'center', color: 'grey',
                }}
              >
                Net profit
              </Text>
            )}
          {parseFloat(sales) -
            (parseFloat(openingstock) +
              parseFloat(purchases) -
              parseFloat(ClosingStock)) +
            income -
            parseFloat(expenses) <
            0 && (
              <Text
                style={{
                  flex: 1,
                  fontWeight: 'bold',
                  alignSelf: 'center', color: 'grey',
                }}
              >
                Net loss
              </Text>
            )}
          {parseFloat(sales) -
            (parseFloat(openingstock) +
              parseFloat(purchases) -
              parseFloat(ClosingStock)) +
            income -
            parseFloat(expenses) >
            0 &&
            parseFloat(sales) -
            (parseFloat(openingstock) +
              parseFloat(purchases) -
              parseFloat(ClosingStock)) +
            income -
            parseFloat(expenses) >
            0 && (
              <Text
                style={{
                  paddingLeft: 5,
                  color: 'grey', flex: 1.5,
                  textAlign: 'center',
                  borderTopWidth: 1,
                  borderColor: 'blue',
                }}
              >
                {(
                  parseFloat(sales) -
                  (parseFloat(openingstock) +
                    parseFloat(purchases) -
                    parseFloat(ClosingStock)) +
                  income -
                  parseFloat(expenses)
                ).toFixed(2)}
              </Text>
            )}
          {parseFloat(sales) -
            (parseFloat(openingstock) +
              parseFloat(purchases) -
              parseFloat(ClosingStock)) +
            parseFloat(income) -
            parseFloat(expenses) <
            0 && (
              <Text
                style={{
                  paddingLeft: 5,
                  color: 'grey', flex: 1.5,
                  textAlign: 'center',
                  borderTopWidth: 1,
                  borderColor: 'blue',
                }}
              >
                {(
                  parseFloat(sales) -
                  (parseFloat(openingstock) +
                    parseFloat(purchases) -
                    parseFloat(ClosingStock)) +
                  income -
                  parseFloat(expenses)
                ).toFixed(2)}
                {/* {parseFloat(sales).toFixed(2)} */}
              </Text>
            )}
          {parseFloat(sales) +
            parseFloat(expenses) +
            parseFloat(income) +
            parseFloat(purchases) -
            parseFloat(ClosingStock) ==
            0 && (
              <Text
                style={{
                  paddingLeft: 5,
                  color: 'grey', flex: 1.5,
                  textAlign: 'center',
                  borderTopWidth: 1,
                  borderColor: 'blue',
                }}
              >
                {parseFloat(sales).toFixed(2)}
              </Text>
            )}
        </View>
        {/* previous and next month buttons */}
        <View
          style={
            (styles.flexRow, { alignItems: 'center', flexDirection: 'column' })
          }
        >
          <View style={{ flexDirection: 'row', marginTop: 18, justifyContent: "center", alignItems: "center", }}>
            <TouchableOpacity onPress={() => subtract()} style={{
              flex: .2,
              borderWidth: .5,
              borderColor: 'blue',
              flexDirection: 'row',
              borderRadius: 80,
              alignContent: "center",
              justifyContent: "center",
            }}  >
              <Text style={{
                color: 'blue',
                fontWeight: 'bold',
                textAlign: 'center',
                flex: .5,
                fontSize: 28,
              }}> {'<'}</Text></TouchableOpacity>

            <View style={{ flex: .2 }}></View><TouchableOpacity onPress={() => add()} style={{
              flex: .2,
              borderWidth: .5,
              borderColor: 'blue',
              flexDirection: 'row',
              borderRadius: 80,
              alignContent: "center",
              justifyContent: "center",
            }}  >
              <Text style={{
                color: 'blue',
                fontWeight: 'bold',
                textAlign: 'center',
                flex: .5,
                fontSize: 28,
              }}>{'>'}</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// ...
