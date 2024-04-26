import moment from 'moment';
import { Alert, ToastAndroid } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import uuid from "react-native-uuid"
export const db = openDatabase({ name: 'shop.db', createFromLocation: '~data.sqlite' });
export const db1 = openDatabase({ name: 'shop.db', createFromLocation: '~data.sqlite' });
const db2 = openDatabase({ name: 'shop.db', createFromLocation: '~data.sqlite' });
const db3 = openDatabase({ name: 'shop.db', createFromLocation: '~data.sqlite' });
const db4 = openDatabase({ name: 'shop.db', createFromLocation: '~data.sqlite' });
export const Products = () => {
  const vl = ['Can sale products', 'Can approve', 'Can view reports',
    'Can assign new roles', 'Can add new expenses', 'Can add income',
    'Can change settings', 'Can add new product'
  ];
  // vl.forEach(element => {
  //   db.executeSql(
  //     'insert into role (id,name) values (?,?)',
  //     [vl.indexOf(element), element], null, (e) => {

  //     }
  //   );
  // });
  let admingrouproles = [];
  db.transaction((tx) => {
    tx.executeSql(
      'Select * from grouproles Where `group`= ?',
      [1],
      (_, { rows }) => {
        if (rows.length < 1) {
          db.transaction((tx) => {
            tx.executeSql(
              'Select * from role Where 1',
              [],
              (_, { rows }) => {
                for (let i = 0; i < rows.length; i++) {
                  const gr = rows.item(i);
                  db.executeSql(
                    'insert into grouproles ( `group`,`role` ) values (?,?)',
                    [1, gr.id],
                    (_, { rows }) => null, (e) => {

                      ToastAndroid.showWithGravity(JSON.stringify(e),
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER)

                    }
                  );
                }
              }, (er) => {
                alert(JSON.stringify(er));
              });
          });
        }
      }, (er) => {
        alert(JSON.stringify(er));
      });
  })


  saveGroup('Admin');
  // saveRoles(admingrouproles, { name: 'Admin', id: 1 });

  updateOpeningStock();
  updateclosingstock();
};
export const getrolebyid = (id) => {

  return new Promise(resolve => {

    // alert('qwerty'+id);
    db.executeSql(
      'Select * From role Where id=?;',
      [id],
      (r) => {
        // alert(JSON.stringify(r));
        resolve(r.rows.item(0));
      }, (e) => {

        // alert(JSON.stringify(data));
        ToastAndroid.showWithGravity(JSON.stringify(e),
          ToastAndroid.LONG,
          ToastAndroid.CENTER)
          ;
      }
    );
  }
  );
};
export const getuser = (user, password) => {
  return new Promise(resolve => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM user WHERE name like"%' + user + '%" AND password=?;',
        [password],
        (_, { rows }) => {
          if (rows.length > 0) {
            let user = rows.item(0);
            getrolesbyuser(rows.item(0).id).then((data) => {
              // user['roles'] = data;
              getrolesbygroup(user.group).then((groupdata) => {
                let allroles = [];
                let roles = [...data, ...groupdata];
                for (let i = 0; i < roles.length; i++) {
                  getrolebyid(roles[i].role).then(item => {
                    allroles.push(item);
                    if (i === (roles.length - 1)) {
                      const data = { user: user, roles: allroles };
                      // alert(JSON.stringify(data));
                      db1.executeSql('Delete From currentuser where 1');
                      db1.executeSql('insert into currentuser (user,id) values (?,?)',
                        [JSON.stringify(data), 1], (er) => {
                          // console.log(JSON.stringify({user:user.name,roles:allroles}));
                        }, (er) => {
                          alert(JSON.stringify(er));
                        });
                      getCurrentUser().then(usr => resolve(usr));
                    }
                  });

                }
                if (roles.length === 0) {
                  // alert(JSON.stringify(allroles));
                  const data = { user: user, roles: allroles };
                  db1.executeSql('Delete From currentuser where 1');
                  db1.executeSql('insert into currentuser (user,id) values (?,?)',
                    [JSON.stringify(data), 1], (er) => {
                      // console.log(JSON.stringify({user:user.name,roles:allroles}));
                    }, (er) => {
                      alert(JSON.stringify(er));
                    });
                  getCurrentUser().then(usr => resolve(usr));
                }

              });
            });
          }
          else {
            ToastAndroid.showWithGravity('wrong credentials ! \n verify username, password and try again',
              ToastAndroid.LONG,
              ToastAndroid.CENTER);
            resolve(null)
          }
        },
        (er) => {
          alert('qwerfgh' + JSON.stringify(er));
        },
      );
    }, null);
  }
  );

}
export const ChangePassword = (userId, password) => {
  db.executeSql(
    'Update user set password=? where id=?',
    [password, userId],

    () => {
      alert('Password changed successfully');
    },
    (er) => {
      alert(JSON.stringify(er));
    },
  );
};
const getrolesbygroup = (groupid) => {
  return new Promise(resolve => {
    db1.transaction((t) => {
      t.executeSql(
        'SELECT * FROM `grouproles` WHERE (`group`=?);',
        [groupid],
        (_, { rows }) => {
          // alert(JSON.stringify(rows.item(0)));
          let data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          resolve(data);
        },
        (er) => {
          alert(JSON.stringify(er));
          resolve(null);

        },
      );

    }, null);
  });
}
const getrolesbyuser = (userid) => {
  return new Promise(resolve => {
    db2.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM `userroles` WHERE userId=' + userid + ';',
        [],
        (_, { rows }) => {
          let data = [];
          for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            data.push(row);
          }
          resolve(data);
        },
        (er) => {
          alert(JSON.stringify(er));
        },
      );

    }, null);
  });
}

export const createNewUser = (question, answer, newpassword1, newpassword2, username, newaccount) => {
  return new Promise(resolve => {
    if (newpassword1 == newpassword2) {
      // alert('JSON.stringify(user)');
      checkuser(username).then(r => {

        if (r.key == true) {
          db.executeSql(
            'insert into user (question, answer, password, name) values (?,?,?,?)',
            [question, answer, newpassword1, username],

            (insertId) => {
              if (insertId == 1)
                db.executeSql(
                  'Update user set group=? where name=?',
                  [1, username],

                  () => {
                    ToastAndroid.showWithGravity('account updated successfully',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER);
                    getuser(username, newpassword1).then(v => {
                      if (v != null)
                        resolve(v)
                    });
                  },
                  (er) => {
                    alert(JSON.stringify(er));
                  },
                );
              ToastAndroid.showWithGravity("account created successfully",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER);
              getuser(username, newpassword1).then(v => {
                if (v != null)
                  resolve(v)
              });
            },
            (er) => {
              alert(JSON.stringify(er));
            },
          );
        }

        else {
          if (!newaccount)
            db.executeSql(
              'Update user set question=?, answer=?, password=? where name=?',
              [question, answer, newpassword1, username],

              () => {
                alert('account updated successfully');
                getuser(username, newpassword1).then(v => {
                  if (v != null)
                    resolve(v)
                });
              },
              (er) => {
                alert(JSON.stringify(er));
              },
            );
          else
            alert('username ' + username + ' already exist');
        }
      }, null);
    } else {
      alert('password did not match ');
    }
  });
};

export const logout = () => {
  return new Promise(resolve => {
    db1.executeSql('Delete From currentuser', [], (r) => {
      // alert(JSON.stringify(r));
      resolve(r);
    }
    );
  }
  );

}
export const saveGroup = (name) => {
  // console.warn("got hee");
  return new Promise(resolve => {
    // console.log(rows.length());
    db.transaction((tx) => {
      tx.executeSql(
        'select * from groups where name=?',
        [name],
        (_, { rows }) => {
          // alert(JSON.stringify(rows.item(0)));

          // console.log("wertyuiokjhgfdsdfghj+" + rows.length);
          if (rows.length < 1) {
            db.executeSql(
              'insert into groups (name) values (?)',
              [name],
              () => resolve("Group saved successifully"), (e) => {

                ToastAndroid.showWithGravity(JSON.stringify(e),
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER)

              }
            );
          }
          else resolve("This group already exist");
        }, (e) => {

          ToastAndroid.showWithGravity(JSON.stringify(e),
            ToastAndroid.LONG,
            ToastAndroid.CENTER)

        }
      );
    }
    );
  }
  );
};
export const getgroups = (setDataSource, setRoles) => {
  let allRoles = []
  let rws = []
  getallgroups().then((response) => {
    // console.log(response);

    for (let k = 0; k < response.length; k++) {
      let group = response[k];
      getrolesbygroup(group.id).then((roles) => {
        group['roles'] = roles;
        rws.push(group)
        if (k == (response.length - 1)) {
          // alert(JSON.stringify(rws,null,2));
          setDataSource(rws);
        }
      });
    }

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM role WHERE 1;',
        null,
        (_, { rows }) => {
          let ln = rows.length;
          for (let j = 0; j < ln; j++) {
            let rw = rows.item(j);
            allRoles.push(rw);
          } setRoles(allRoles);
        },
        (er) => {
          alert(JSON.stringify(er));
        },
      );

    }, null);
  }
  );
}
const getallgroups = () => {
  return new Promise((resolve) => {
    // 'SELECT * FROM grouproles  left join groups on `group` = groups.id Where 1;', null,
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM groups Where 1;', null,
        (_, { rows }) => {
          let response = [];
          // console.log(JSON.stringify(rows));
          for (let i = 0; i < rows.length; i++) {
            const { name, id } = rows.item(i);
            response.push({ name, id });
          }
          resolve(response);
        },
        (er) => {
          alert(JSON.stringify(er));
        },
      );
    }, null);
  });
};
const getallgrouproles = () => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM groups Where 1;`, null,
        (_, { rows }) => {
          let response = [];
          for (let i = 0; i < rows.length; i++) {
            const { name, id } = rows.item(i);
            response.push({ name, id });
          }
          resolve(response);
        },
        (er) => {
          alert(JSON.stringify(er));
        },
      );
    }, null);
  });
};
export const Groups = (setGroups) => {

  let rws = []
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM groups Where 1;`, null,
      (_, { rows }) => {
        let len = rows.length;
        for (let i = 0; i < len; i++) {
          let row = rows.item(i);
          row["label"] = row.name;
          rws.push(row);
        }
        setGroups(rws);
      },
      (er) => {
        alert(JSON.stringify(er));
      },
    );
  }, null);
}
export const getUsers = (setDataSource, setRoles) => {

  return new Promise(resolve => {
    let allRoles = []
    let rws = []

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM role  WHERE 1;',
        null,
        (_, { rows }) => {
          let ln = rows.length;
          for (let j = 0; j < ln; j++) {
            let rw = rows.item(j);
            allRoles.push(rw);
          } setRoles(allRoles);
        },
        (er) => {
          alert(JSON.stringify(er));
        },
      );
      tx.executeSql(
        'SELECT  *, groups.name as gname,user.name as name FROM  user  left join  `userroles` on userId=user.id inner join groups on `group` =groups.id Where 1;', null,
        // `SELECT * FROM  user Where 1;`, null,
        (_, { rows }) => {
          let len = rows.length;
          for (let i = 0; i < len; i++) {
            let row = rows.item(i);
            rws.push(row);
            if ((i + 1) == len) {
              console.log(rws);
              setDataSource(rws);
            }  // alert(JSON.stringify(rows.item(0)));
            // db.transaction((tx) => {
            //   tx.executeSql(
            //     'SELECT * FROM `userroles` WHERE userId=' + row.id + ';',
            //     [],
            //     (_, { rows }) => {
            //       row["roles"] = rows;
            //       rws.push(row);
            //       if ((i + 1) == len) {
            //         console.log(rws);
            //         setDataSource(rws);
            //       }  // alert(JSON.stringify(rows.item(0)));
            //     },
            //     (er) => {
            //       alert(JSON.stringify(er));
            //     },
            //   );

            // }, null);
          }
        },
        (er) => {
          alert(JSON.stringify(er));
          resolve("rws");
        },
      );
      resolve("rws");
    }, null);
  }
  );
}
export const saveRoles = (grouproles, group) => {
  return new Promise(resolve => {


    db.executeSql('DELETE FROM grouproles Where `group`=?',
      [group.id], null, (e) => {
        ToastAndroid.showWithGravity(JSON.stringify(e),
          ToastAndroid.LONG,
          ToastAndroid.CENTER)

      }
    );
    // alert(JSON.stringify(group));

    for (let i = 0; i < grouproles.length; i++) {
      const gr = grouproles[i];
      if (gr.checked)
        db.executeSql(
          'insert into grouproles ( `group`,`role` ) values (?,?)',
          [group.id, gr.id],
          (_, { rows }) => null, (e) => {

            ToastAndroid.showWithGravity(JSON.stringify(e),
              ToastAndroid.LONG,
              ToastAndroid.CENTER)

          }
        );
    }
    resolve("done")
  });
}
export const saveUserRoles = (userroles, user, group) => {
  console.log({ userroles: userroles, user: user, group: group });
  return new Promise(resolve => {
    db.executeSql('DELETE FROM userroles Where `userId`=?',
      [user.id], (e) => {
        // 
        // ToastAndroid.showWithGravity(JSON.stringify(e),
        //   ToastAndroid.LONG,
        //           ToastAndroid.CENTER)

      }, (e) => {

        ToastAndroid.showWithGravity(JSON.stringify(e),
          ToastAndroid.LONG,
          ToastAndroid.CENTER)

      }
    );
    for (let i = 0; i < userroles.length; i++) {
      const gr = userroles[i];
      if (gr.checked)
        db.executeSql(
          'insert into userroles ( `userId`,`role` ) values (?,?)',
          [user.id, gr.id],
          () => null, (e) => {

            ToastAndroid.showWithGravity(JSON.stringify(e),
              ToastAndroid.LONG,
              ToastAndroid.CENTER)

          }
        );
    }
    if (group != null) db.executeSql(
      'UPDATE user SET `group`=? WHERE id=?',
      [group.id, user.id], null,
      (e) =>
        ToastAndroid.showWithGravity(JSON.stringify(e),
          ToastAndroid.LONG,
          ToastAndroid.CENTER)
    );
    resolve("done");
  });
}
export const checkuser = (user) => {
  return new Promise(resolve => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM user WHERE name=? ORDER BY id DESC LIMIT 1;',
        [user],
        (_, { rows }) => {
          if (rows.length > 0) {

            resolve({ "key": false, "data": rows.item(0) });
          }
          else {
            resolve({ "key": true, "data": null });

          }
        },
        (er) => {
          alert(JSON.stringify(er));
        },
      );
    }, null);
  }
  );

}
export const getCurrentUser = () => {
  return new Promise(resolve => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM currentuser WHERE id= 1;',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0))
          }
          else {
            resolve("null")
          }
        },
        (er) => {
          alert(JSON.stringify(er));
        },
      );
    }, null);
  });
};

export const cancelThisTransaction = (receptid) => {
  cancelsales(receptid);
  db.transaction((tx) => {
    tx.executeSql('DELETE FROM receipt Where id = ? ', [receptid],
      (c, pp) => ToastAndroid.showWithGravity('Transaction was successfully reversed',
        ToastAndroid.LONG,
        ToastAndroid.CENTER), e =>
      ToastAndroid.showWithGravity(JSON.stringify(e),
        ToastAndroid.LONG,
        ToastAndroid.CENTER));
    ;
  });
};
export const cancelsales = (receptid) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM sales Where receiptId =?',
      [receptid],
      (_, { rows }) => {
        if (rows.length > 0) {
          let len = rows.length;
          let rws = []
          for (let i = 0; i < len; i++) {
            let { id, quantity, prdStatusId } = rows.item(i);
            db1.transaction((getproduct) => {
              getproduct.executeSql(
                'UPDATE productStatus SET remaining=(remaining + ' + quantity + ') WHERE id=?',
                [prdStatusId],
                r => {
                  // alert(JSON.stringify(r))

                }, e =>
                ToastAndroid.showWithGravity(JSON.stringify(e),
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER)

              );
              getproduct.executeSql(
                `DELETE FROM Sales WHERE id =` + id,
                [],
                (_, { rows }) => console.log('Sales deleted'),
              );
            });
          };
        }
      }, e =>
      ToastAndroid.showWithGravity(JSON.stringify(e),
        ToastAndroid.LONG,
        ToastAndroid.CENTER)

    );
  });
};
export const correctAndSaveThisTransaction = (receptid, data, total) => {
  //  for each product in sold products List
  //   get a product by id
  //   select its quantity =>quantityValue
  // get prstoduct from stock and add quantityValue to its remaining
  // delete sale
  // and finally edit reciept
  // and save new product sales
  //   ""
  cancelsales(receptid);
  db.transaction((nt) => {
    nt.executeSql(
      'UPDATE receipt SET total = ? WHERE id =?',
      [total, receptid],
      (_, { rows }) => {
        // alert(JSON.stringify(data)+"insertId");
        data.reduce((prev, { price, id, prdStatusId, size, q }) => {
          db.transaction((tns) => {
            tns.executeSql(
              'insert into sales (receiptId, prdStatusId, total, quantity) values (?,?,?,?)',
              [receptid, prdStatusId, price, q],
              (_, { insertId }) => {
                alert(JSON.stringify("insertId" + insertId));
                db.executeSql(
                  'UPDATE productStatus SET remaining=(remaining -' + q + ') WHERE id=?',
                  [prdStatusId],
                  (p, r) => alert('Transaction was successful'),
                  e =>
                    ToastAndroid.showWithGravity(JSON.stringify(e),
                      ToastAndroid.LONG,
                      ToastAndroid.CENTER)

                );
              },
              e =>
                ToastAndroid.showWithGravity(JSON.stringify(e),
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER)

            );
          });
        }, 0);
        // alert('transaction saved successfully');
      }, (e) =>
      ToastAndroid.showWithGravity(JSON.stringify(e),
        ToastAndroid.LONG,
        ToastAndroid.CENTER)
      ,
    );

  });
};
export const updateclosingstock = () => {
  return new Promise(resolve => {
    db.transaction((tx) => {
      let date = moment(new Date()).endOf('month').format('DD MMMM YYYY');
      tx.executeSql(
        'SELECT cost*remaining as netclosingStock FROM products inner join productStatus on productId=products.id WHERE remaining > 0',
        [],
        (_, { rows }) => {
          const netclosingStock = rows.item(0).netclosingStock;
          db1.transaction((x) => {
            x.executeSql(
              'SELECT * FROM operation Where    date  LIKE "%' + date + '%" and type  LIKE "closing stock"', [],
              (_, { rows }) => {
                if (rows.length > 0) {
                  db.executeSql(
                    'UPDATE operation SET value=' + netclosingStock + ' Where id=?',
                    [rows.item(0).id],
                    () => {
                      ToastAndroid.showWithGravity('closing stock updated successfully',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER); resolve('done')
                    },
                    e =>
                      ToastAndroid.showWithGravity(JSON.stringify(e),
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER)

                  );
                }
                else getCurrentUser().then(user => {
                  addOperation('', netclosingStock, date, 'closing stock', user.name, uuid.v4()).then(d => resolve('done'))
                })
              }, (e) =>
              ToastAndroid.showWithGravity(JSON.stringify(e),
                ToastAndroid.LONG,
                ToastAndroid.CENTER)
              ,
            );
          }, null);

        }, e =>

        ToastAndroid.showWithGravity(JSON.stringify(e),
          ToastAndroid.LONG,
          ToastAndroid.CENTER)

      );
    }, null);
  })
};
export const updateOpeningStock = () => {
  let date = moment(new Date()).startOf('month').format('DD MMMM YYYY');
  db.transaction((tx) => {
    tx.executeSql('Select * From operation where date="' + date + '" and type="Opening stock"', [], (_, { rows }) => {
      if (rows.length > 0) {
        // alert('got here');
      }
      else
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT cost*remaining as totalcost FROM products inner join productStatus on productId=products.id WHERE remaining > 0 ',
            [],
            (_, { rows }) => {
              let rws = []
              for (let i = 0; i < rows.length; i++) {
                let row = rows.item(i);
                rws.push(row);
              }
              const netOpeningStock = rws.reduce((prev, { totalcost }) => {
                return prev + totalcost;
              }, 0);
              getCurrentUser().then(user => {
                addOperation('', netOpeningStock, date, 'Opening stock', user.name).then(r => {
                  // if ((typeof (r)).toString().toLowerCase() == 'number') alert('done');
                  // else alert("there has been an error saving data");
                })
              })
            }, e =>
            ToastAndroid.showWithGravity(JSON.stringify(e),
              ToastAndroid.LONG,
              ToastAndroid.CENTER)


          );
        }, null)
    }, e =>
      ToastAndroid.showWithGravity(JSON.stringify(e),
        ToastAndroid.LONG,
        ToastAndroid.CENTER));
    ;

  }, null);
};
export const updateTrial = (setFullName, setPhoneNumber, setTry) => {
  return new Promise((resolve) => {
    db.transaction((tns) => {
      tns.executeSql(
        'Select * From owner WHERE 1',
        [],
        (_, { rows }) => {

          if (rows.item(0)) {
            if (rows.item(0).paid === 'Fully Paid') { resolve(true); }
            else {
              if (rows.length > 0) {
                setTry(false);
                setPhoneNumber(rows.item(0).PhoneNumber);
                setFullName(rows.item(0).FullName);
                let now = moment(new Date());
                let date = moment(new Date(rows.item(0).date));
                let newperiod = rows.item(0).period - now.diff(date, 'days')
                if ((newperiod > -1) && (now.isAfter(date))) db.transaction((s) => {
                  s.executeSql(
                    'update owner set date=?, period=? Where id=' + rows.item(0).id,
                    [now, newperiod],
                    (_, r) => {
                      resolve(true);
                    },
                    e =>
                      ToastAndroid.showWithGravity(JSON.stringify(e),
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER)

                  );
                })
                else if (rows.item(0).paid === null) {
                  ToastAndroid.showWithGravity("Trial period expired",
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER); resolve(false);
                }
                else if (rows.item(0).paid === 'Partly Paid') {
                  alert("Activated term expired");
                  resolve(false);
                }
              }
              else {
                resolve(false);
              }
            }
          }
          else {
            resolve(false);
            setTry(true);
          }
        },
        e =>
          ToastAndroid.showWithGravity(JSON.stringify(e),
            ToastAndroid.LONG,
            ToastAndroid.CENTER)


      );

    }, null);
  });
};
export const deleteIncome = (Income, id) => {
  db.transaction((tx) => {
    tx.executeSql(`DELETE FROM Income WHERE id =` + id, [], (_, { rows }) => {
      console.log(Income + ' deleted successfully');
    });
  }, null);
};
export const deleteProduct = (product, id) => {
  db.transaction((tx) => {
    tx.executeSql(`DELETE FROM products WHERE id =?`, [id], (_, { rows }) => {
    }); tx.executeSql(`DELETE FROM productStatus WHERE productId =?`, [id], (_, { rows }) => {
      console.log(product + ' deleted successfully');
    });
  }, null);
};
export const deleteUser = (user, id) => {
  getCurrentUser().then(usr => {
    // alert(JSON.stringify(usr) +"======="+ user)
    if (usr.userid != id) {
      db.transaction((tx) => {
        tx.executeSql(`DELETE FROM user WHERE id =` + id, [], () => {
          ToastAndroid.showWithGravity(user + ' deleted successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER);
        });
      }, null);
    } else  ToastAndroid.showWithGravity('You can not delete account you are currently using',
    ToastAndroid.LONG,
    ToastAndroid.CENTER); 
  })

};
const addActivity = (activity, doneby, date, aproved) => {
  return new Promise(resolve =>

    db.transaction((t) => {
      t.executeSql('Select * From activitylog Where date=? And doneby=? And activity=?', [date, doneby, activity], (t, { rows }) => {
        if (rows.length > 0) {
          resolve(rows.item(0).id);
        }
        else {
          db.transaction((tx) => { tx.executeSql('insert into activitylog (activity, doneby,date, aproved) values (?,?,?,?)', [activity, doneby, date, aproved], (t, { insertId }) => { resolve(insertId) }, (er) => alert(JSON.stringify(er))) })
        }
      }, (e) => alert('activityid' + JSON.stringify(e)));
    })
  )
};
const insertProduct = (orderid, barcode, name, quantity, size, cost, id) => {
  return new Promise(resolve =>
    db.transaction((t) => {
      // alert(id);
      t.executeSql(`Select * From products Where name=? And size=?`, [name, size], (t, { rows }) => {
        if (rows.length > 0) {
          let pid = rows.item(0).id; quantity = parseFloat(quantity) + parseFloat(rows.item(0).quantity);
          db.transaction((tx) => { tx.executeSql(`Update products Set quantity=?, cost=?  Where id=?;`, [quantity, cost, pid], (t, { rows }) => { resolve(pid); }, (er) => alert(JSON.stringify(er))) })
        }
        else {
          db.transaction((tx) => {
            tx.executeSql(`insert into products (orderid,barcode, name, quantity, size, cost ,id) values (?,?,?,?,?,?,?)`,
              [orderid, barcode, name, quantity, size, cost, id], () => { resolve(id) }, (er) => alert("qwertyu" + JSON.stringify(er)))
          })
        }
      });
    })
  )
};
const addOrder = (activityid, total) => {
  return new Promise(resolve => {

    db.transaction((t) => {
      t.executeSql('Select * From orders Where activityid=' + parseInt(activityid), [], (tz, { rows }) => {
        if (rows.length > 0) {
          let oid = rows.item(0).id; total = total + parseFloat(rows.item(0).total);
          db.transaction((tx) => { tx.executeSql('Update orders set total=?  Where id=?;', [total, oid], (t, { rows }) => { resolve(oid); }, (er) => alert(JSON.stringify(er))) })
        } else {
          db.transaction((tx) => { tx.executeSql('insert into orders (total,activityid) values (?,?)', [total, activityid], (t, { insertId }) => { resolve(insertId) }, (er) => alert(JSON.stringify(er))) })
        }
      }, (er) => alert(JSON.stringify(er)));
    })
  })
}
const addProductStatus = (productId, quantity, uprice) => {
  return new Promise(resolve => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM productStatus Where productId =?', [productId], (t, { rows }) => {
        if (rows.length > 0) {
          let psid = rows.item(0).id; quantity = parseFloat(rows.item(0).remaining) + parseFloat(quantity);
          db.transaction((tx) => {
            tx.executeSql('UPDATE productStatus SET price=? , remaining=?  Where id=?;', [uprice, quantity, psid], (t, { rows }) => {
              resolve(psid);
            }, (er) => { alert(JSON.stringify(er)); resolve(psid); })
          })
        } else {
          db.transaction((tx) => {
            tx.executeSql('insert into productStatus (price, remaining, productId) values (?,?,?)', [uprice, quantity, productId],
              (t, { insertId }) => {
                resolve(insertId)
              },
              (er) => { resolve(psid); })
          })
        }
      }, (er) => alert(JSON.stringify(er)))
    });
  })

}
export const saveSettings = (ecocash, bond, profitmargin) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Settings SET ecocash=? ,bond=? ,profitmargin=? WHERE id=1;',
        [ecocash, bond, profitmargin],
      );
      tx.executeSql(
        'insert into Settings (ecocash ,bond ,profitmargin ) values (?,?,?)',
        [ecocash, bond, profitmargin],
      );
      tx.executeSql(
        'SELECT * FROM Settings ORDER BY id DESC LIMIT 1;',
        []
      );
    }, null);
  } catch (error) {
    db.transaction((tx) => {
      tx.executeSql(
        'insert into Settings (ecocash ,bond ,profitmargin ) values (?,?,?)',
        [ecocash, bond, profitmargin],
      );
      tx.executeSql(
        'SELECT * FROM Settings ORDER BY id DESC LIMIT 1',
        []
      );
    }, null);
  }
  ToastAndroid.showWithGravity('Data saved successfully',
    ToastAndroid.LONG,
    ToastAndroid.CENTER)

};
export const AddProduct = ({ barcode, name, quantity, size, cost, price, date, id, user }) => {
  let activity = "adding new product ";
  addActivity(activity, user, date, false).then(activityid => {//alert('activityid'+JSON.stringify(activityid));
    let total = parseFloat(cost) * parseFloat(quantity);
    addOrder(activityid, total).then(orderid => {//alert('orderid'+JSON.stringify(orderid));
      insertProduct(orderid, barcode, name, quantity, size, cost, id).then((productid) => {// alert('productid'+JSON.stringify(productid));
        addProductStatus(productid, quantity, price).then((r) => {
          // alert('Product saved successfully');
          updateclosingstock();
        });
      });
    });
  });
};
const allProductStatus = () => {
  return new Promise(resolve =>

    db.transaction((t) => {
      t.executeSql('SELECT * FROM productStatus Left Join products On productId=products.id ', [], (t, { rows }) => {
        let rws = []
        for (let i = 0; i < rows.length; i++) {
          let row = rows.item(i);
          rws.push(row);
        } resolve(rws);

      }, e =>
        ToastAndroid.showWithGravity(JSON.stringify(e),
          ToastAndroid.LONG,
          ToastAndroid.CENTER));
      ;
    })
  )
};
export const getAllProducts = (setData) => {
  allProductStatus().then((ps) => {
    // alert(JSON.stringify(ps));
    setData(ps);

  });

};
export const insertBadproducts = (description, ucost, date) => {
  db.transaction((tx) => {
    tx.executeSql(
      'insert into badproducts (description, cost, date) values (?,?,?)',
      [description, parseFloat(ucost), date],
    );
    tx.executeSql(
      'SELECT * FROM badproducts ORDER BY id DESC LIMIT 1',
      [],
      (_, { rows }) => {

        ToastAndroid.showWithGravity(rows.item(0).description + '  expense saved successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER)

      },
    );
  }, null);
};
export const addOperation = (description, value, date, type, user, id) => {
  return new Promise(resolve =>
    addActivity("record expense", user, date, false).then(activityid =>
      db.transaction((tx) => {
        tx.executeSql(
          'insert into operation (description, value, date,type,activity_id,id) values (?,?,?,?,?,?)',
          [description, value, date, type, activityid, id], (t, { insertId }) => resolve(insertId), (er) => resolve(er)
        );
        // tx.executeSql('SELECT * FROM Expenses ORDER BY id DESC LIMIT 1', []);
      }, null)))

};
export const deleteExpense = (name, id) => {

  // alert(typeof (id));
  db.transaction((tx) => {
    tx.executeSql(`DELETE FROM operation WHERE id =?`, [id], () => {

      ToastAndroid.showWithGravity(name + ' deleted successfully',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER)

    });
  }, null);

};

export const insertIncome = (description, ucost, date) => {
  db.transaction((tx) => {
    tx.executeSql(
      'insert into Income (description, cost, date) values (?,?,?)',
      [description, parseFloat(ucost), date],
      db1.transaction(() => {
        tx.executeSql('SELECT * FROM Income ORDER BY id DESC LIMIT 1', []);
      }),
    );
  }, null);
};
export const insertPurchase = (cost) => {
  let date = moment(new Date()).format('MMMM YYYY');
  db.transaction((tn) => {
    tn.executeSql(
      'SELECT * FROM Purchases Where date  LIKE "%' + date + '%"',
      [],
      (_, { rows }) => {
        db1.transaction((tn1) => {
          if (rows.length > 0) {
            tn1.executeSql(
              'UPDATE Purchases SET cost=? Where date  LIKE "%' + date + '%"',
              [cost],
              (_, { rows }) => {
                console.log(rows);
              },
            );
          } else {
            tn1.executeSql(
              'insert into Purchases (cost, date) values (?,?)',
              [cost],
              (_, { rows }) => {
                console.log(rows);
              },
            );
          }
        });
      },
    );
  });
};
export const updateProduct = (barcode, name, size, cost, price, id) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE products SET barcode=?, name=?, size=?, cost=? WHERE id=?',
        [
          barcode,
          name,
          size,
          cost,
          id,
        ],
        () => {
          db.transaction((tx) => {
            tx.executeSql('UPDATE productStatus SET price=?  Where productId=?;',
              [price, id], (t, { rows }) => {
                resolve(name + ' updated successfully');
              }, (er) => { alert(JSON.stringify(er)); })
          })

        }, (er) => { alert(JSON.stringify(er)); }
      );
    }, null);
  });
};

export const saveTransaction = (dataSource, totalprice, date, rid, user) => {
  let activity = "adding new product ";
  addActivity(activity, user, date, false).then(activityid => {
    db.transaction((tx) => {
      tx.executeSql('insert into receipt (time ,total,activityid,id ) values (?,?,?,?)', [date, totalprice, activityid, rid], (_, r) => {
        dataSource.reduce((prev, { price, id, remaining, q }) => {
          // const Remaining = parseInt(remaining) - parseInt(q);
          db.transaction((tns) => {
            tns.executeSql(
              'Select id From productStatus WHERE productId=?',
              [id],
              (_, { rows }) => {
                db.transaction((s) => {
                  s.executeSql(
                    'insert into sales (receiptId, prdStatusId, total, quantity) values (?,?,?,?)',
                    [rid, rows.item(0).id, price, q],
                    (_, { insertId }) => {
                      // alert('JSON.stringify(insertId)');
                      // 'UPDATE productStatus SET remaining="'+Remaining+'" WHERE id=?',
                      db.executeSql(
                        'UPDATE productStatus SET remaining=(remaining - ' + q + ') WHERE productId=?',
                        [id],
                        (pp) => {
                          ToastAndroid.showWithGravity('Transaction was successful',
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER)

                        },
                        e =>
                          ToastAndroid.showWithGravity(JSON.stringify(e),
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER)


                      );
                    },
                    e =>
                      ToastAndroid.showWithGravity(JSON.stringify(e),
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER)

                  );

                })
              },
              e =>
                ToastAndroid.showWithGravity(JSON.stringify(e),
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER)


            );

          });
        }, 0);
        // console.log(rows.item(0).id);
      },
        e =>
          ToastAndroid.showWithGravity(JSON.stringify(e),
            ToastAndroid.LONG,
            ToastAndroid.CENTER));
      ;
    })
  }
  );
};

export const Settings = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'Select id From Settings WHERE 1',
      [],
      (_, { rows }) => {
        if (rows.length > 0) {
        }
        else db.transaction((s) => {
          s.executeSql(
            'insert into Settings (ecocash ,bond ,profitmargin,theme ,id) values (?,?,?,?,?)',
            [120, 100, 20, 'dark', 1],
            (_, { insertId }) => {
            },
            e =>
              ToastAndroid.showWithGravity(JSON.stringify(e),
                ToastAndroid.LONG,
                ToastAndroid.CENTER)

          );

        })

      },
      e =>
        ToastAndroid.showWithGravity(JSON.stringify(e),
          ToastAndroid.LONG,
          ToastAndroid.CENTER)


    );
  });
};

export const updateSettings = (ecocash, bond, profitmargin) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE Settings SET ecocash=? ,bond=? ,profitmargin=? WHERE id=1;',
      [ecocash, bond, profitmargin],
    );
    tx.executeSql(
      'SELECT * FROM Settings ORDER BY id DESC LIMIT 1;',
      [],
      (_, { rows }) => {
        console.log('Data updated successfully');
        navigation.goBack();
      },
    );
  }, null);
};
export const Register = ({ FullName, PhoneNumber, deviceName, UniqueId, activated, paid, date, period }) => {
  return new Promise((resolve) => {
    db.transaction((tns) => {
      tns.executeSql(
        'Select * From owner WHERE 1',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            db.transaction((s) => {
              s.executeSql(
                'update owner Set FullName=?, PhoneNumber=?, activated=?, paid=?, date=?, period=? Where id=' + rows.item(0).id,
                [FullName, PhoneNumber, activated, paid, date, period],
                (_, r) => {
                  resolve(rows.item(0));
                },
                e =>
                  ToastAndroid.showWithGravity(JSON.stringify(e),
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER)

              );
            })
          }
          else {
            db.transaction((s) => {
              s.executeSql(
                'insert into owner (mainDeviceUniqueId,mainDeviceName, FullName, PhoneNumber, activated, paid, date, period) values (?,?,?,?,?,?,?,?)',
                [UniqueId, deviceName, FullName, PhoneNumber, activated, paid, date, period],
                (_, { insertId }) => {
                  resolve(insertId);
                },
                e =>
                  ToastAndroid.showWithGravity(JSON.stringify(e),
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER)

              );

            })
          }

        },
        e =>
          ToastAndroid.showWithGravity(JSON.stringify(e),
            ToastAndroid.LONG,
            ToastAndroid.CENTER)


      );

    }, null);
  })
};
export const AddDevice = ({ FullName, PhoneNumber, deviceName, UniqueId, activated, paid, date, period }, owner) => {
  return new Promise((resolve) => {
    db.transaction((tns) => {
      tns.executeSql(
        'Select id From activation WHERE deviceUniqueId=? and deviceName=?',
        [UniqueId, deviceName],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0).id);
          }
          else db.transaction((s) => {
            s.executeSql(
              'insert into activation (deviceUniqueId,deviceName, owner) values (?,?,?)',
              [UniqueId, deviceName, owner],
              (_, { insertId }) => {
                resolve(insertId);
              },
              e =>

                ToastAndroid.showWithGravity(JSON.stringify(e),
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER)

            );

          })

        },
        e =>
          ToastAndroid.showWithGravity(JSON.stringify(e),
            ToastAndroid.LONG,
            ToastAndroid.CENTER)


      );

    }, null);
  })
};
export const insertSettings = (ecocash, bond, profitmargin) => {
  db.transaction((tx) => {
    tx.executeSql(
      'insert into Settings (ecocash ,bond ,profitmargin ) values (?,?,?)',
      [ecocash, bond, profitmargin],
    );

    tx.executeSql(
      'SELECT * FROM Settings ORDER BY id DESC LIMIT 1',
      [],
      (_, { rows }) => {
        ToastAndroid.showWithGravity('Data saved successfully',
        ToastAndroid.LONG,
        ToastAndroid.CENTER)
navigation.goBack();
      },
    );
  }, null);
};
