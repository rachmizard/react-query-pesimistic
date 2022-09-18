import Button from "./button";

type PaginationProps = {
    page: number;
    count: number;
    onChange: (page: number) => void;
    perPage?: number;
    itemsLength?: number;
    onChangePerPage?: (perPage: number) => void;
};

export default function Pagination(props: PaginationProps) {
    const {
        onChange,
        page,
        itemsLength,
        count,
        perPage = 10,
        onChangePerPage,
    } = props;

    const isDisablePrev = page === 1;
    const isDisableNext =
        Math.ceil(count / perPage) === page || count === itemsLength;

    return (
        <div className="flex flex-col space-y-2">
            <p>
                Current Page: {page} of {Math.ceil(count / perPage)}
            </p>
            <div className="flex items-center space-x-3">
                <Button
                    size="sm"
                    disabled={isDisablePrev}
                    onClick={() => onChange(page - 1)}
                >
                    Prev Page
                </Button>
                <Button
                    size="sm"
                    disabled={isDisableNext}
                    onClick={() => onChange(page + 1)}
                >
                    Next Page
                </Button>

                <select
                    className="border border-gray-300 p-1 rounded-md min-w-[100px]"
                    value={perPage}
                    onChange={(event) => {
                        onChangePerPage &&
                            onChangePerPage(parseInt(event.target.value));
                    }}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
}
