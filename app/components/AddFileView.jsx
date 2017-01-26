import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {postFile} from '../actionCreators/dataActions';
import {searchNameOrHash} from '../manager/fileManager';
import {categories} from '../settings';
import {multihash} from 'is-ipfs';

var AddFileView = withRouter(React.createClass({
	render: function () {
		var categoryOptions = categories.map((elem, i) => {
			return (
				<option value={elem} key={i}>
					{elem}
				</option>
			);
		});
		return (
			<div>
				<div>
					Name
					<input
						id="name"
					/>
				</div>
				<div>
					Description
					<textarea
						id="description"
					/>
				</div>
				<div>
					Category
					<select id="category">
						{categoryOptions}
					</select>
				</div>
				<div>
					Hash
					<input
						id="hash"
					/>
				</div>
				<span
					className="btn"
					onClick={this.handleAddClick}>
					Add
				</span>
			</div>
		)
	},
	handleAddClick: function () {
		//First check in db to see if name and hash are unique
		var file = {};
		file.name = document.getElementById('name').value;
		file.description = document.getElementById('description').value;
		file.hash = document.getElementById('hash').value;
		if (!file.name || !file.description) {
			alert('Files must have a name and a description');
			return;
		}
		if (!multihash(file.hash)) {
			alert('Not a valid multihash');
			return;
		}
		var categoryElement = document.getElementById('category');
		file.category = categoryElement.options[categoryElement.selectedIndex].value;
		console.log(file);
		searchNameOrHash(file.name, file.hash)
		.then(result => {
			console.log('search result', result.length > 0);
			if (result.length === 0) {
				this.props.postFile(file, this.props.router);
			} else {
				alert('A file with this name or hash already exists on the server');
			}
		});
	}
}));

var mapDispatchToProps = (dispatch) => {
	return {
		postFile: function(file, router) {
			dispatch(postFile(file, router));
		}
	}
}

export default connect(
	null,
	mapDispatchToProps
)(AddFileView);
