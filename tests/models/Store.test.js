import Model from '../../src/models/Model';
import Store from '../../src/models/Store';


//================
// TEST CONSTANTS
//================

const string = 'kafjoaja;';
const number = 121221;
const float = 0.392380134;
const bool = true;
const array = [
  string,
  number,
  float,
  bool,
  {
    string,
    number,
    float,
    bool,
  },
  [
    string,
    number,
    float,
    bool,
  ]
];

const object = {
  string,
  number,
  float,
  bool,
  array: [
    string,
    number,
    float,
    bool,
  ],
  object: {
    string,
    number,
    float,
    bool
  }
};


//=============
// TEST MODELS
//=============

class List extends Model {
  static defaultState() {
    return {
      id: '',
      listItems: [],
      otherList: null
    };
  }
}

class ListItem extends Model {
  static defaultState() {
    return {
      id: '',
      dependencies: []
    };
  }
}

const listItem1 = new ListItem({ id: '1' });
const listItem2 = new ListItem({ id: '2', name: 'old name' });
const listItem3 = new ListItem({ id: '3' });
const listItem4 = new ListItem({ id: '4' });

listItem1.setDependencies([listItem4]);
listItem2.setDependencies([listItem1]);
listItem3.setDependencies([listItem2]);

const list1 = new List({ id: '1' });
const list2 = new List({ id: '2' });

list1.setListItems([listItem1, listItem2, listItem3, listItem4]);
list2.setOtherList(list1);

const entityDefinitions = { lists: List, listItems: ListItem };


//=============
// STORE TESTS
//=============

describe('Store', () => {
  let store;
  let state;
  let subState;
  let output;

  beforeEach(() => {

  });

  describe('parse', () => {
    describe('with non-Model data', () => {
      beforeEach(() => {
        state = { string, number, float, bool, array, object, entityDefinitions, listItems: {}, lists: {} };
        store = new Store(state);
        output = store.stringify();
        store = new Store({ entityDefinitions });
        store.parse(output);
      });

      it('should set the correct store state', () => {
        expect(store.state).toEqual(state);
      });
    });

    describe('with Model data', () => {
      beforeEach(() => {
        state = { list: list1, otherList: list2, entityDefinitions };
        store = new Store(state);
        output = store.stringify();
        store = new Store({ entityDefinitions });
        Model.baseId = 1;
        store.parse(output);
      });

      describe('state', () => {
        let list;
        let listItems;
        let otherList;

        beforeEach(() => {
          list = store.getList();
          listItems = list.getListItems();
          otherList = store.getOtherList();
        });

        describe('list', () => {
          it('should have the correct id', () => {
            expect(list.getId()).toBe('1');
          });

          it('should be an instance of List', () => {
            expect(list instanceof List).toBe(true);
          });

          describe('first listItem', () => {
            it('should have the correct id', () => {
              expect(listItems[0].getId()).toBe('1');
            });

            it('should be an instance of ListItem', () => {
              expect(listItems[0] instanceof ListItem).toBe(true);
            });

            it('should contain a dependency reference to the fourth listItem', () => {
              expect(listItems[0].getDependencies()[0]).toBe(listItems[3]);
            });
          });

          describe('second listItem', () => {
            it('should have the correct id', () => {
              expect(listItems[1].getId()).toBe('2');
            });

            it('should be an instance of ListItem', () => {
              expect(listItems[1] instanceof ListItem).toBe(true);
            });

            it('should contain a dependency reference to the first listItem', () => {
              expect(listItems[1].getDependencies()[0]).toBe(listItems[0]);
            });
          });

          describe('third listItem', () => {
            it('should have the correct id', () => {
              expect(listItems[2].getId()).toBe('3');
            });

            it('should be an instance of ListItem', () => {
              expect(listItems[2] instanceof ListItem).toBe(true);
            });

            it('should contain a dependency reference to the second listItem', () => {
              expect(listItems[2].getDependencies()[0]).toBe(listItems[1]);
            });
          });

          describe('fourth listItem', () => {
            it('should have the correct id', () => {
              expect(listItems[3].getId()).toBe('4');
            });

            it('should be an instance of ListItem', () => {
              expect(listItems[3] instanceof ListItem).toBe(true);
            });

            it('should contain a no dependencies', () => {
              expect(listItems[3].getDependencies()).toEqual([]);
            });
          });
        });

        describe('otherList', () => {
          it('should have the correct id', () => {
            expect(otherList.getId()).toBe('2');
          });

          it('should be an instance of List', () => {
            expect(otherList instanceof List).toBe(true);
          });

          it('should contain a reference to list', () => {
            expect(otherList.getOtherList()).toBe(list);
          });
        });
      });
    });
  });

  describe('parseMerge', () => {
    beforeEach(() => {
      subState = { number, float, bool, array, object };
      state = { string, number, float, bool, array, object, entityDefinitions, listItems: {}, lists: {} };
      store = new Store(subState);
      output = store.stringify();
      store = new Store({ string, number: {}, entityDefinitions });
      store.parseMerge(output);
    });

    it('should set the correct store state', () => {
      expect(store.state).toEqual(state);
    });
  });

  describe('stringify', () => {
    beforeEach(() => {
      state = { string, number, float, bool, array, object, entityDefinitions };
      store = new Store(state);
      output = store.stringify('number');
      store = new Store({ entityDefinitions });
      store.parse(output);
    });

    it('should set the correct store state', () => {
      expect(store.state).toEqual({ number, entityDefinitions });
    });
  });

  describe('addEntities', () => {
    beforeEach(() => {
      state = {
        entityDefinitions,
        listItems: {
          1: listItem1,
          2: listItem2
        },
        lists: {}
      };

      store = new Store(state);

      store.addEntities({
        listItems: {
          2: { name: 'updated name' },
          3: { id: 3, name: 'new name' }
        },
        lists: {
          1: { id: 1, name: 'new list' }
        }
      });
    });

    it('should not replace the first list item', () => {
      expect(store.getListItems()[1]).toBe(listItem1);
    });

    it('should not replace the second list item', () => {
      expect(store.getListItems()[2]).toBe(listItem2);
    });

    it('should update the second list item', () => {
      expect(store.getListItems()[2].getName()).toBe('updated name');
    });

    it('should create the third list item', () => {
      expect(store.getListItems()[3].getName()).toBe('new name');
    });

    it('should create the first list', () => {
      expect(store.getLists()[1].getName()).toBe('new list');
    });
  });

  describe('createEntityHelpers', () => {
    beforeEach(() => {
      state = {
        entityDefinitions: {
          listItems: ListItem,
          lists: List,
          newEntity: {},
          falseEntity: {}
        },
        listItems: {
          1: listItem1,
          2: listItem2
        },
        lists: {
          1: list1,
        },
        falseEntity: false
      };

      store = new Store(state);
    });

    describe('when multiple ids are provided', () => {
      it('should return an array of items', () => {
        expect(store.findListItems([1, 2])).toEqual([listItem1, listItem2]);
      });
    });

    describe('when one id is provided', () => {
      it('should return the item', () => {
        expect(store.findLists(1)).toBe(list1);
      });
    });

    describe('when a false entity is not correctly stored', () => {
      it('should not define a find function', () => {
        expect(store.findFalseEntity).not.toBeDefined();
      });
    });

    describe('when a new entity is not stored', () => {
      it('should create an findNewEntity function', () => {
        expect(store.findNewEntity).toBeDefined();
      });

      it('should create an empty object for the new entity', () => {
        expect(store.state.newEntity).toEqual({});
      });
    });
  });
});
