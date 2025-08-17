import * as React from 'react';
import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  Text,
  Checkbox,
  useSelection,
  CheckboxOnChangeData,
} from "@fluentui/react-components";

type User = {
  id: number;
  firstName: string | null;
  lastName: string;
  age: number | null;
};

const columns: TableColumnDefinition<User>[] = [
  createTableColumn<User>({
    columnId: 'id',
    renderHeaderCell: () => 'ID',
    renderCell: (item) => <Text>{item.id}</Text>,
  }),
  createTableColumn<User>({
    columnId: 'firstName',
    renderHeaderCell: () => 'First name',
    renderCell: (item) => <Text>{item.firstName}</Text>,
  }),
  createTableColumn<User>({
    columnId: 'lastName',
    renderHeaderCell: () => 'Last name',
    renderCell: (item) => <Text>{item.lastName}</Text>,
  }),
  createTableColumn<User>({
    columnId: 'age',
    renderHeaderCell: () => 'Age',
    renderCell: (item) => <Text>{item.age}</Text>,
  }),
  createTableColumn<User>({
    columnId: 'fullName',
    renderHeaderCell: () => 'Full name',
    renderCell: (item) => (
      <Text>{`${item.firstName || ''} ${item.lastName || ''}`}</Text>
    ),
  }),
];

const rows: User[] = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export const UserGrid = () => {
  const [
    selectedItems,
    {
      toggleItem,
      toggleAllItems,
    },
  ] = useSelection({
    selectionMode: "multiselect",
    defaultSelectedItems: new Set([1, 2]),
  });

  const allItemsSelected = selectedItems.size === rows.length;
  const someItemsSelected = selectedItems.size > 0 && !allItemsSelected;
  const allItemIds = React.useMemo(() => rows.map(item => item.id), []);

  return (
    <div style={{ height: 400, width: '100%', overflowY: 'auto' }}>
      <DataGrid
        items={rows}
        columns={columns}
        getRowId={(item) => item.id}
        selectionMode="multiselect"
        style={{ minWidth: '700px' }}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <>
                <DataGridHeaderCell>
                  <Checkbox
                    checked={allItemsSelected ? true : someItemsSelected ? 'mixed' : false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => toggleAllItems(e, allItemIds)}
                  />
                </DataGridHeaderCell>
                {renderHeaderCell()}
              </>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<User>>
          {({ item, rowId }) => (
            <DataGridRow<User>
              key={rowId}
              onClick={(e: React.MouseEvent) => toggleItem(e, rowId as number)}
              appearance={selectedItems.has(rowId as number) ? 'brand' : 'none'}
            >
              {({ renderCell }) => (
                <>
                  <DataGridCell>
                    <Checkbox
                      checked={selectedItems.has(rowId as number)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => toggleItem(e, rowId as number)}
                    />
                  </DataGridCell>
                  {renderCell(item)}
                </>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  );
};