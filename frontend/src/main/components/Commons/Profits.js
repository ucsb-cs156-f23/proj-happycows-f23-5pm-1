import React from "react";
import { Card, Button } from "react-bootstrap";
import OurTable from "main/components/OurTable";
import { useBackend } from "main/utils/useBackend";
import { useParams } from "react-router";
import { timestampToDate } from "main/utils/dateUtils";

const Profits = ({}) => {
    const testId = "Profits";
    // create a constant that decides how many records to be displayed
    const PROFIT_PAGE_SIZE = 5;

    // speed of refreshing
    const refreshJobsIntervalMilliseconds = 5000;

    //
    const [selectedPage, setSelectedPage] = React.useState(0);

    // get commons id
    let { commonsId } = useParams();
    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
    const memoizedColumns = React.useMemo(
        () => [
            {
                Header: "Profit",
                accessor: (row) => `$${row.amount.toFixed(2)}`,
            },
            {
                Header: "Date",
                accessor: (row) => `${timestampToDate(row.timestamp)}`,
            },
            {
                Header: "Health",
                accessor: (row) => `${row.avgCowHealth + "%"}`,
            },
            {
                Header: "Cows",
                accessor: "numCows",
            },
        ],
        []
    );

    // Stryker restore ArrayDeclaration

    const { data: profit, refetch } = useBackend(
        ["/api/profits/paged/commonsid"],
        {
            ///api/profits/paged/commonsid?commonsId=1&page=0&size=5
            method: "GET",
            url: "/api/profits/paged/commonsid",
            params: {
                commonsId: commonsId,
                pageNumber: selectedPage,
                pageSize: PROFIT_PAGE_SIZE,
            },
        },
        { content: [], totalPages: 0 },
        { refetchInterval: refreshJobsIntervalMilliseconds }
    );

    // handle next and previous page

    const previousPageCallback = () => {
        setSelectedPage(selectedPage - 1);
        refetch();
    };

    const nextPageCallback = () => {
        setSelectedPage(selectedPage + 1);
        refetch();
    };
    return (
        <Card>
            <Card.Header as="h5">Profits</Card.Header>
            <Card.Body>
                {/* change 4am to admin-appointed time? And consider adding milk bottle as decoration */}
                <Card.Title>
                    You will earn profits from milking your cows everyday at
                    4am.
                </Card.Title>
                <Button
                    data-testid={`${testId}-previous-button`}
                    onClick={previousPageCallback}
                    disabled={selectedPage === 0}
                >
                    Previous
                </Button>
                <Button
                    data-testid={`${testId}-next-button`}
                    onClick={nextPageCallback}
                    disabled={
                        profit.totalPages === 0 ||
                        selectedPage === profit.totalPages - 1
                    }
                >
                    Next
                </Button>
                <OurTable
                    // data={memoizedDates}
                    data={profit.content}
                    columns={memoizedColumns}
                    testid={"Profits"}
                />
            </Card.Body>
        </Card>
    );
};

export default Profits;
