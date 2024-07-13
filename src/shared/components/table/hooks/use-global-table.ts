import React, { useEffect, useState } from "react";
import { useDebouncedFunction } from "../hocs/debounce-search";
import { SearchCellsType } from "../enhanced-table-head";


const getField = <T>(object: T, orderBy: any) => {

  const a = orderBy.split('.');
  let res: any = object
  for(const b of a) {
    res = res[b]
  }

  return res
}
function descendingComparator<T>(a: T, b: T, orderBy: keyof T | null) {
	if (orderBy === null) {
		return 0
	}

	if ( getField(b, orderBy) <  getField(a, orderBy)) {
		return -1;
	}
	if (getField(b, orderBy) >  getField(a, orderBy)) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator(
	order: Order,
	orderBy: any,
): (
	a: { [key in string]: number | string },
	b: { [key in string]: number | string },
) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: Array<any>, comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

interface IGlobalTableConfig<T> {
  id: string,
	rows: T[]
	selectable?: boolean
	searchCells?: SearchCellsType<T>;
}

export interface IGlobalTable<T extends { id: string }> {
	id: string,
  rows: T[]
	searchCells?: SearchCellsType<T>;
	emptyRows: number,
	selectable: boolean,
	visibleRows: any[],
	order: Order,
	orderBy: keyof T | null,
	selected: string[],
	page: number,
	rowsPerPage: number,
	rowsPerPageOptions: number[],
	checked: boolean,
	search: string,
	isSearchable: boolean,
	isSelectable?: boolean,
  resetTable: () => void,
	handleRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void,
	handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void,
	handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void,
	handleSelectAllRowsClick: () => void,
	handleDeselectAllRowsClick: () => void,
	handleSelectCurrentPageRowsClick: (event: React.ChangeEvent<HTMLInputElement>) => void,
	handleClick: (event: React.MouseEvent<unknown>, name: string) => void,
	isSelected: (value: string) => boolean,
	handleSearch: (search: string) => void

}

export const useGlobalTable = <T extends { id: string }>(props: IGlobalTableConfig<T>): IGlobalTable<T> => {

	const { rows, searchCells, selectable, id } = props

  const _rowsPerPage = 5
  const _rowsPerPageOptions = [5, 10, 25, 50]

	const [filteredRows, setFilteredRows] = React.useState<T[]>(rows);
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof T | null>(null);
	const [selected, setSelected] = React.useState<string[]>([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(_rowsPerPage);
	const [checked, setChecked] = React.useState<boolean>(false);
	const [search, setSearch] = useState<string>('')

	const handleSearch = useDebouncedFunction(setSearch);

	const filterRows = (rows: T[], search: string) => {
		if (!searchCells?.length || !search.length) {
			return rows;
		}

		const searchResult: T[] = []
		const existingIds: string[] = []
		for (const row of rows) {
			for (const [key, value] of Object.entries(row as Object)) {
				if (searchCells.includes(key as any) && value.includes(search) && !existingIds.includes(row.id)) {
					searchResult.push(row)
					existingIds.push(row.id)
				}
			}
		}

		return searchResult;
	}

	const handleRequestSort = (
		_: React.MouseEvent<unknown>,
		property: keyof T,
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const mapIds = (rows: T[]): string[] => {
		return rows.map((n) => n.id);
	}

	const getCurrentPageItems = () => {
		const offsets = getTableOffsets(page, rowsPerPage)
		return filteredRows.slice(offsets.from, offsets.to)
	}

	const getCurrentPageIds = () => {
		const currentPageItems = getCurrentPageItems()
		return mapIds(currentPageItems)

	}

	const handleSelectAllRowsClick = () => {
		const newSelected = filteredRows.map((n) => n.id);
		setSelected((prev) => {
			const difference: string[] = newSelected.filter(element => !selected.includes(element));
			return [...prev, ...difference]
		});

	};

	const resetTable = () => {
		setSelected([])
		setPage(0)
		handleSearch(search)
	}

	const handleDeselectAllRowsClick = () => {
		setSelected([])
	};

	const handleSelectCurrentPageRowsClick = (event: React.ChangeEvent<HTMLInputElement>) => {

		const currentPageItemsIds = getCurrentPageIds()
		if (event.target.checked) {
			setSelected((prev) => {
				const difference: string[] = currentPageItemsIds.filter(element => !selected.includes(element));
				return [...prev, ...difference]
			});
			return
		}

		const difference: string[] = selected.filter(element => !currentPageItemsIds.includes(element));
		setSelected(difference);
	};

	const handleClick = (_: React.MouseEvent<unknown>, name: string) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected: string[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name: string) => selected.indexOf(name) !== -1;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;
 
	const visibleRows = stableSort(filteredRows, getComparator(order, orderBy)).slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage,
	)

	const getTableOffsets = (page: number, rowsPerPage: number) => {

		return {
			from: page * rowsPerPage,
			to: (page + 1) * rowsPerPage
		}
	}

	useEffect(() => {
		if (!selected.length) {
			setChecked(false)
			return
		}

		const currentPageItemsIds = getCurrentPageIds()
		const allElementsInArr2: boolean = currentPageItemsIds.every(element => selected.includes(element));
		setChecked(allElementsInArr2)

	}, [page, rowsPerPage, selected, search, filteredRows])


	useEffect(() => {
		setFilteredRows(rows)
	}, [rows])


	useEffect(() => {
		setFilteredRows(filterRows(rows, search))
		setPage(0)
	}, [search])

	return {
    id,
		rows: filteredRows,
		selectable: Boolean(selectable),
		emptyRows,
		visibleRows,
		order,
		orderBy,
		selected,
		page,
		rowsPerPage,
		rowsPerPageOptions: _rowsPerPageOptions,
		checked,
		search,
		isSearchable: Boolean(searchCells?.length),
    isSelectable: selectable,
		resetTable,
		handleRequestSort,
		handleChangePage,
		handleChangeRowsPerPage,
		handleSelectAllRowsClick,
		handleDeselectAllRowsClick,
		handleSelectCurrentPageRowsClick,
		handleClick,
		isSelected,
		handleSearch
	}

}