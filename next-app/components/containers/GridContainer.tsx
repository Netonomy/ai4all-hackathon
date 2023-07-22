import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { ReactElement } from "react";

export interface GridItemProps<T> {
  index: number;
  item: T;
}

type GridContainerProps<T> = {
  items: T[];
  Component: React.FC<GridItemProps<T>>;
};

export default function GridContainer<T>({
  items,
  Component,
}: GridContainerProps<T>): ReactElement | null {
  return (
    <>
      {items.length > 0 ? (
        <div className="w-full h-full content-start ">
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => {
              let columnCount: number, columnWidth: number, rowHeight: number;
              if (width >= 500) {
                columnCount = 5;
                columnWidth = width / 5;
                rowHeight = 150;
              } else if (width >= 300) {
                columnCount = 4;
                columnWidth = width / 4;
                rowHeight = 120;
              } else {
                columnCount = 1;
                columnWidth = width;
                rowHeight = 100;
              }

              return (
                <Grid
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={height}
                  rowCount={Math.ceil(items.length / columnCount)}
                  rowHeight={rowHeight}
                  width={width}
                >
                  {({ columnIndex, rowIndex, style }) => {
                    const index = rowIndex * columnCount + columnIndex;
                    const item = items[index];
                    return item ? (
                      <div style={style}>
                        <Component index={index} item={item} />
                      </div>
                    ) : null;
                  }}
                </Grid>
              );
            }}
          </AutoSizer>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className="h-full w-full flex flex-col items-center justify-center">
            <div className="text-lg font-semibold">Empty</div>
          </div>
        </div>
      )}
    </>
  );
}
