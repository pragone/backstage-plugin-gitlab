import React from 'react';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { gitlabAppData } from '../../gitlabAppData';
import { GitlabCIApiRef } from '../../../api';
import { useApi } from '@backstage/core-plugin-api';
import { MergeRequest } from '../../types';
import { getElapsedTime, getDuration } from '../../utils';
import { createTitleColumn } from './columns';

export const DenseTable = ({ mergeRequests }: any) => {
	const columns: TableColumn[] = [
		{ title: 'ID', field: 'id' },
		createTitleColumn(),
		{ title: 'Creator', field: 'author' },
		{ title: 'State', field: 'state' },
		{ title: 'Created At', field: 'created_date' },
		{ title: 'Duration', field: 'duration' },
	];
	const title = 'Gitlab Merge Request Status: ' + mergeRequests?.project_name;
	const data = mergeRequests.data.map((mergeRequest: MergeRequest) => {
		return {
			id: mergeRequest.id,
			state: mergeRequest.state,
			author: mergeRequest.author.username,
			title: mergeRequest.title,
			web_url: mergeRequest.web_url,
			created_date: getElapsedTime(mergeRequest.created_at),
			duration: getDuration(mergeRequest.created_at, mergeRequest.updated_at),
		};
	});

	return (
		<Table
			title={title}
			options={{ search: true, paging: true }}
			columns={columns}
			data={data}
		/>
	);
};

export const MergeRequestsTable = ({}) => {
	const { project_id } = gitlabAppData();

	const GitlabCIAPI = useApi(GitlabCIApiRef);

	const { value, loading, error } = useAsync(async (): Promise<
		MergeRequest[]
	> => {
		const gitlabObj = await GitlabCIAPI.getMergeRequestsSummary(project_id);
		const data = gitlabObj?.getMergeRequestsData;
		let renderData: any = { data };
		renderData.project_name = await GitlabCIAPI.getProjectName(project_id);
		return renderData;
	}, []);

	if (loading) {
		return <Progress />;
	} else if (error) {
		return <Alert severity='error'>{error.message}</Alert>;
	}

	return <DenseTable mergeRequests={value || []} />;
};
