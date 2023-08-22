import {
    GetListResponse,
    useCustom,
    useDataProvider,
    useResourceSubscription,
    UseResourceSubscriptionProps,
} from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Avatar } from "antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { IPost } from "../../interfaces";
import { useEffect } from "react";
import { directusClient } from "src/directusClient";

export const PostList: React.FC<IResourceComponentsProps<GetListResponse<IPost>>> = ({ initialData }) => {
    const dataProvider = useDataProvider();

    const { tableProps } = useTable<IPost>({
        syncWithLocation: false,
    });

    //Sample useCustom hook
    /*
    const { refetch } = useCustom<any>({
        url: "/items/posts/2",
        method: "patch",
        config: {
            payload: { title:"Testing Custom 2"},
            query: { fields: ['*', 'image.*', 'gallery.*.*'] }
        },
        queryOptions: {
            enabled: true,
        },
    });
    */

    useResourceSubscription({
        resource: "posts",
        types: ["created"],
        enabled: true,
        channel:"posts_create",
        liveMode:"auto",
        onLiveEvent:(event)=>
        {
            console.log("OnLive", event);
        }
    });

/*
    useEffect(() => {
        async function test() {

            console.log("test");
            const { subscription, unsubscribe } = await directusClient.subscribe("posts", {
                query: { fields: ["*"] },
                uid: "posts_create",
                event: "create",
            });

            //unsubscribe();

            for await (const item of subscription) {
                // this loop wil await new subscription events
                console.log("subscription", item);
            }
        }
        test();
    }, []); 
*/
    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="image"
                    title="Image"
                    align="center"
                    render={(data) =>
                        data ? (
                            <Avatar src={dataProvider().getApiUrl() + "assets/" + data} alt="Image" size={64} />
                        ) : (
                            <Avatar size={64} />
                        )
                    }
                />
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="status" title="Status" />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column<IPost>
                    title="Actions"
                    dataIndex="actions"
                    render={(_text, record): React.ReactNode => {
                        return (
                            <Space>
                                <EditButton size="small" recordItemId={record.id} />
                                <ShowButton size="small" recordItemId={record.id} />
                                <DeleteButton size="small" recordItemId={record.id} />
                            </Space>
                        );
                    }}
                />
            </Table>
        </List>
    );
};
