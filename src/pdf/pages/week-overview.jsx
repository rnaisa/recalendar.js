import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import {
	DATE_FORMAT as SPECIAL_DATES_DATE_FORMAT,
	findByDate,
	HOLIDAY_DAY_TYPE,
} from 'configuration-form/special-dates';
import { getWeekNumber } from 'lib/date';
import Header from 'pdf/components/header';
import MiniCalendar, { HIGHLIGHT_WEEK } from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';
import { weekOverviewLink, dayPageLink } from 'pdf/lib/links';
import { content, pageStyle } from 'pdf/styles';

class WeekOverviewPage extends React.Component {
	styles = StyleSheet.create(
		Object.assign(
			{
				days: {
					flexDirection: 'row',
					flexWrap: 'wrap',
					flexGrow: 1,
					paddingTop: 1,
					paddingLeft: 1,
				},
				day: {
					width: '33.5%',
					height: '33.5%',
					border: '1 solid black',
					flexDirection: 'column',
					marginTop: -1,
					marginLeft: -1,
					padding: 5,
					textDecoration: 'none',
					color: 'black',
				},
				dayDate: {
					flexDirection: 'row',
					flexGrow: 1,
					marginBottom: 2,
				},
				dayOfWeek: {
					fontSize: 12,
					fontWeight: 'bold',
				},
				shortDate: {
					fontSize: 12,
					textTransform: 'uppercase',
					marginLeft: 'auto',
				},
				todos: {
					width: '66.6%',
					height: '33.5%',
					flexDirection: 'column',
					padding: 5,
				},
				todo: {
					fontSize: 10,
				},
				specialItem: {
					fontSize: 10,
				},
				tickbox: {
					height: 10,
					width: 10,
					borderWidth: 1,
					borderColor: 'darkgrey',
					marginRight: 20,
					padding: 6,
				},
				dayTickbox: {
					height: 10,
					width: 10,
					borderWidth: 1,
					margin: 2,
					borderColor: 'darkgrey',
					alignSelf: 'flex-end',
				},
				dayOfWeekContainer: {
					height: '100%',
					flexDirection: 'column',
					justifyContent: 'space-between',
				},
			},
			{ content, page: pageStyle( this.props.config ) },
		),
	);

	getNameOfWeek() {
		const { date } = this.props;
		const beginningOfWeek = date.startOf( 'week' ).format( 'DD MMMM' );
		const endOfWeek = date.endOf( 'week' ).format( 'DD MMMM' );
		return `${beginningOfWeek} - ${endOfWeek}`;
	}

	renderDays() {
		const { date } = this.props;
		let currentDate = date.startOf( 'week' );
		const endOfWeek = date.endOf( 'week' );
		const days = [];
		while ( currentDate.isBefore( endOfWeek ) ) {
			days.push( this.renderDay( currentDate ) );
			currentDate = currentDate.add( 1, 'day' );
		}

		days.push( this.renderTodos() );

		return days;
	}

	renderDay( day ) {
		const { config } = this.props;
		const specialDateKey = day.format( SPECIAL_DATES_DATE_FORMAT );
		const specialItems = config.specialDates.filter( findByDate( specialDateKey ) );
		return (
			<Link
				key={ day.unix() }
				style={ this.styles.day }
				src={ '#' + dayPageLink( day, config ) }
			>
				<View style={ this.styles.dayOfWeekContainer }>
					<View style={ this.styles.dayDate }>
						<Text style={ this.styles.dayOfWeek }>{day.format( 'dddd' )}</Text>
						<Text style={ this.styles.shortDate }>{day.format( 'DD MMM' )}</Text>
					</View>
					{specialItems.map( ( { id, type, value } ) => (
						<Text
							key={ id }
							style={ [
								this.styles.specialItem,
								{ fontWeight: type === HOLIDAY_DAY_TYPE ? 'bold' : 'normal' },
							] }
						>
							» {value}
						</Text>
					) )}
					<View style={ this.styles.dayTickbox }></View>
				</View>
			</Link>
		);
	}

	renderTodos() {
		return (
			<View key={ 'todos' } style={ this.styles.todos }>
				{this.props.config.todos.map( ( { id, value } ) => (
					<Text key={ id } style={ this.styles.todo }>
						{value}
					</Text>
				) )}
			</View>
		);
	}

	render() {
		const { t, date, config } = this.props;
		return (
			<Page id={ weekOverviewLink( date, config ) } size={ config.pageSize }>
				<View style={ this.styles.page }>
					<Header
						isLeftHanded={ config.isLeftHanded }
						title={ t( 'page.week.title' ) }
						subtitle={ this.getNameOfWeek() }
						number={ getWeekNumber( date ).toString() }
						previousLink={
							'#' + weekOverviewLink( date.subtract( 1, 'week' ), config )
						}
						nextLink={ '#' + weekOverviewLink( date.add( 1, 'week' ), config ) }
						calendar={
							<MiniCalendar
								date={ date }
								highlightMode={ HIGHLIGHT_WEEK }
								config={ config }
							/>
						}
					/>
					<View style={ this.styles.days }>{this.renderDays()}</View>
				</View>
			</Page>
		);
	}
}

WeekOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( WeekOverviewPage );
