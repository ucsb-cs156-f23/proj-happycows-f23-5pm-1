import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Profits from "main/components/Commons/Profits";
import userCommonsFixtures from "fixtures/userCommonsFixtures";
import profitsFixtures from "fixtures/profitsFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Router } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

// used to mock useParams() to get the commonsId
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
}));

describe("Profits tests", () => {
    const queryClient = new QueryClient();

    const axiosMock = new AxiosMockAdapter(axios);

    // mock commons ID
    // mocking use params

    const testId = "Profits";

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
    });

    test("renders correct content", async () => {
        // telling jest to spy on the router component, wait for useParams() to be called
        // spy will then return it with mocked value commonsId:1
        jest.spyOn(Router, "useParams").mockReturnValue({
            commonsId: 1,
        });

        // let { commonsId } = useParams();

        // arrange
        // ?commonsId=1&pageNumber=2&pageSize=5
        axiosMock
            .onGet(
                //`/api/profits/paged/commonsid?commonsId=1&pageNumber=0&pageSize=5`
                "/api/profits/paged/commonsid/?"
            )
            .reply(200, profitsFixtures.oneProfit);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Profits />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        const expectedHeaders = ["Profit", "Date", "Health", "Cows"];
        const expectedFields = ["Profit", "Date", "Health", "numCows"];

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(axiosMock.history.get.length).toBe(1);
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(
                `${testId}-cell-row-0-col-${field}`
            );
            expect(header).toBeInTheDocument();
        });

        expect(axiosMock.history.get[0].url).toBe(
            "/api/profits/paged/commonsid"
        );
        expect(axiosMock.history.get[0].params).toEqual({
            pageNumber: 1,
            pageSize: 5,
        });

        const nextButton = screen.getByTestId(`${testId}-next-button`);
        expect(nextButton).toBeInTheDocument();
        expect(nextButton).toBeDisabled();

        const previousButton = screen.getByTestId(`${testId}-previous-button`);
        expect(previousButton).toBeInTheDocument();
        expect(previousButton).toBeDisabled();
    });

    // test("renders correct content with multiple pages", async () => {
    //     // arrange

    //     axiosMock
    //         .onGet("/api/profits/paged/commonsid", {
    //             params: { pageNumber: 1, pageSize: 5 },
    //         })
    //         .reply(200, profitsFixtures.threeProfits[0]);
    //     axiosMock
    //         .onGet("/api/profits/paged/commonsid", {
    //             params: { pageNumber: 2, pageSize: 5 },
    //         })
    //         .reply(200, profitsFixtures.threeProfits[1]);
    //     axiosMock
    //         .onGet("/api/profits/paged/commonsid", {
    //             params: { pageNumber: 3, pageSize: 5 },
    //         })
    //         .reply(200, profitsFixtures.threeProfits[2]);

    //     // act
    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <Profits />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     // assert
    //     const expectedHeaders = ["Profit", "Date", "Health", "Cows"];

    //     expectedHeaders.forEach((headerText) => {
    //         const header = screen.getByText(headerText);
    //         expect(header).toBeInTheDocument();
    //     });

    //     await waitFor(() => {
    //         expect(axiosMock.history.get.length).toBe(1);
    //     });

    //     // expectedFields.forEach((field) => {
    //     //     const header = screen.getByTestId(
    //     //         `${testId}-cell-row-0-col-${field}`
    //     //     );
    //     //     expect(header).toBeInTheDocument();
    //     // });

    //     expect(axiosMock.history.get[0].url).toBe(
    //         "/api/profits/paged/commonsid"
    //     );
    //     expect(axiosMock.history.get[0].params).toEqual({
    //         pageNumber: 0,
    //         pageSize: 5,
    //     });

    //     const nextButton = screen.getByTestId(`${testId}-next-button`);
    //     expect(nextButton).toBeInTheDocument();

    //     const previousButton = screen.getByTestId(`${testId}-previous-button`);
    //     expect(previousButton).toBeInTheDocument();

    //     expect(previousButton).toBeDisabled();
    //     expect(nextButton).toBeEnabled();

    //     expect(screen.getByText(`Page: 1`)).toBeInTheDocument();
    //     fireEvent.click(nextButton);

    //     await waitFor(() => {
    //         expect(screen.getByText(`Page: 2`)).toBeInTheDocument();
    //     });
    //     expect(previousButton).toBeEnabled();
    //     expect(nextButton).toBeEnabled();

    //     fireEvent.click(previousButton);
    //     await waitFor(() => {
    //         expect(screen.getByText(`Page: 1`)).toBeInTheDocument();
    //     });
    //     expect(previousButton).toBeDisabled();
    //     expect(nextButton).toBeEnabled();

    //     fireEvent.click(nextButton);
    //     await waitFor(() => {
    //         expect(screen.getByText(`Page: 2`)).toBeInTheDocument();
    //     });

    //     fireEvent.click(nextButton);
    //     await waitFor(() => {
    //         expect(screen.getByText(`Page: 3`)).toBeInTheDocument();
    //     });

    //     expect(previousButton).toBeEnabled();
    //     expect(nextButton).toBeDisabled();
    // });

    // test("renders properly for empty profits array", () => {
    //     render(
    //         <Profits
    //             userCommons={userCommonsFixtures.oneUserCommons[0]}
    //             profits={[]}
    //         />
    //     );
    // });

    // test("renders properly when profits is not defined", async () => {
    //     render(<Profits userCommons={userCommonsFixtures.oneUserCommons[0]} />);
    //     await waitFor(() => {
    //         expect(
    //             screen.getByTestId("Profits-header-Profit")
    //         ).toBeInTheDocument();
    //     });
    // });

    // test("renders properly when profits is non-empty", async () => {
    //     render(
    //         <Profits
    //             userCommons={userCommonsFixtures.oneUserCommons[0]}
    //             profits={profitsFixtures.threeProfits}
    //         />
    //     );

    //     expect(
    //         await screen.findByTestId("Profits-cell-row-0-col-Profit")
    //     ).toBeInTheDocument();
    //     expect(
    //         screen.getByTestId("Profits-cell-row-0-col-Profit")
    //     ).toHaveTextContent(/52.80/);
    //     expect(
    //         screen.getByTestId("Profits-cell-row-1-col-Profit")
    //     ).toHaveTextContent(/54.60/);
    //     expect(
    //         screen.getByTestId("Profits-cell-row-2-col-Profit")
    //     ).toHaveTextContent(/58.20/);

    //     expect(
    //         screen.getByTestId("Profits-cell-row-0-col-date")
    //     ).toHaveTextContent(/2023-05-17/);
    //     expect(
    //         screen.getByTestId("Profits-cell-row-1-col-date")
    //     ).toHaveTextContent(/2023-05-16/);
    //     expect(
    //         screen.getByTestId("Profits-cell-row-2-col-date")
    //     ).toHaveTextContent(/2023-05-15/);

    //     expect(
    //         screen.getByTestId("Profits-cell-row-0-col-Health")
    //     ).toHaveTextContent(/88%/);
    //     expect(
    //         screen.getByTestId("Profits-cell-row-1-col-Health")
    //     ).toHaveTextContent(/91%/);
    //     expect(
    //         screen.getByTestId("Profits-cell-row-2-col-Health")
    //     ).toHaveTextContent(/97%/);

    //     expect(
    //         screen.getByTestId("Profits-cell-row-0-col-numCows")
    //     ).toHaveTextContent(/6/);
    //     expect(
    //         screen.getByTestId("Profits-cell-row-1-col-numCows")
    //     ).toHaveTextContent(/6/);
    //     expect(
    //         screen.getByTestId("Profits-cell-row-2-col-numCows")
    //     ).toHaveTextContent(/6/);
    // });
});
