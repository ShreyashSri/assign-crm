import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

import {
  Button,
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  Text,
} from "@fluentui/react-components";
import { DocumentAddRegular } from "@fluentui/react-icons";

interface Item {
  itemKey: number;
  [key: string]: any;
}

export const ExcelReader = () => {
  const [columns, setColumns] = useState<TableColumnDefinition<Item>[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (jsonData.length < 1) return;
      const header = jsonData[0];
      const newColumns: TableColumnDefinition<Item>[] = header.map((col, index) =>
        createTableColumn<Item>({
          columnId: `col${index}`,
          renderHeaderCell: () => col,
          renderCell: (item) => <Text>{item[`col${index}`]}</Text>,
        })
      );
      setColumns(newColumns);
      const dataRows = jsonData.slice(1);
      const newItems: Item[] = dataRows.map((row, rowIndex) => {
        const item: Item = { itemKey: rowIndex };
        header.forEach((_, index) => {
          item[`col${index}`] = row[index] || '';
        });
        return item;
      });
      setItems(newItems);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".xlsx, .xls, .csv"
      />
      <Button
        icon={<DocumentAddRegular />}
        onClick={handleUploadClick}
        appearance="primary"
        style={{ alignSelf: 'flex-start' }}
      >
        Upload Excel File
      </Button>
      {items.length > 0 && (
        <>
            <Text weight="semibold">Displaying data from: {fileName}</Text>
            <DataGrid
                items={items}
                columns={columns}
                getRowId={(item: Item) => item.itemKey}
            >
                <DataGridHeader>
                <DataGridRow>
                    {(column: TableColumnDefinition<Item>) => (
                    <DataGridHeaderCell key={column.columnId}>
                        {column.renderHeaderCell()}
                    </DataGridHeaderCell>
                    )}
                </DataGridRow>
                </DataGridHeader>
                <DataGridBody>
                {({ item, rowId }: { item: Item; rowId: React.Key }) => (
                    <DataGridRow key={rowId}>
                    {(column: TableColumnDefinition<Item>) => (
                        <DataGridCell key={column.columnId}>
                        {column.renderCell(item)}
                        </DataGridCell>
                    )}
                    </DataGridRow>
                )}
                </DataGridBody>
            </DataGrid>
        </>
      )}
    </div>
  );
};