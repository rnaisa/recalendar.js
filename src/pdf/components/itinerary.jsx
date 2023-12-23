import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { ITINERARY_ITEM, ITINERARY_LINES, ITINERARY_TODO_LINES } from 'configuration-form/itinerary';

class Itinerary extends React.PureComponent {
	styles = StyleSheet.create( {
		line: {
			borderBottom: '1 solid #AAA',
			fontSize: 12,
			fontWeight: 'bold',
			height: 20,
			minHeight: 20,
			padding: '2 0 0 5',
		},
		todoLine: {
			flexDirection: 'row',
			alignItems: 'center',
			borderBottomWidth: 1,
			borderBottomColor: 'grey',
			height: 23,
			minHeight: 23,
		},
		tickbox: {
			borderWidth: 1,
			borderColor: 'darkgrey',
			marginRight: 37,
			padding: 6,
		},
		text: {
			flex: 1,
			height: 30,
			padding: 10,
		},
		verticalLine: {
			width: 100,
			height: '100%',
			borderRightWidth: 1,
			borderColor: 'darkgrey',
		},
	} );

	renderItineraryItem = ( { type, value }, index ) => {
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderItem( value, index );

			case ITINERARY_LINES:
			default:
				return this.renderLines( value );

			case ITINERARY_TODO_LINES:
				return this.renderTodoLines( value );
		}
	};

	renderItem( text, index ) {
		return (
			<Text key={ index } style={ this.styles.line }>
				{text}
			</Text>
		);
	}

	renderLines( count ) {
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push( <Text key={ i } style={ this.styles.line }></Text> );
		}

		return lines;
	}

	renderTodoLines( count ) {
		const todoLines = [];
		for ( let i = 0; i < count; i++ ) {
			todoLines.push(
				<View key={ i } style={ this.styles.todoLine }>
					<View style={ this.styles.verticalLine }></View>
					<Text style={ this.styles.text }></Text>
					<View style={ this.styles.tickbox }></View>
				</View>
			);
		}
		return todoLines;
	}

	render() {
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	items: PropTypes.array.isRequired,
};

export default Itinerary;
