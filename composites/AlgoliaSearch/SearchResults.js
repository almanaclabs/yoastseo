import React from "react";
import PropTypes from "prop-types";
import a11ySpeak from "a11y-speak";
import { injectIntl, intlShape, defineMessages } from "react-intl";
import styled from "styled-components";
import { ZebrafiedListTable } from "../basic/Table/ListTable";
import { Row } from "../basic/Table/Row";
import colors from "../../style-guide/colors.json";

const messages = defineMessages( {
	noResultsText: {
		id: "searchresults.noresultstext",
		defaultMessage: "No results found.",
	},
	foundResultsText: {
		id: "searchresults.foundresultstext",
		defaultMessage: "Found {resultsCount} { resultsCount, plural, one {result} other {results} }",
	},
} );

/**
 * The title of the search result item.
 */
const SearchResultTitle = styled.p`
	padding-left: 10px;
	margin: 0;
	font-size: 1em;
	font-weight: normal;
`;

/**
 * The link to the search result.
 */
const SearchResultLink = styled.a`
	color: ${ colors.$color_black };
	padding: 10px;
	
	&:hover, &:focus {
		color: ${ colors.$color_pink_dark };
	}
`;

/**
 * Returns a single search result item.
 *
 * @param {Object} props Properties of the SearchResult component.
 * @returns {ReactElement} The rendered search result.
 */
export function SearchResult( props ) {
	let post = props.post;

	return (
		<Row {...props}>
			<SearchResultLink href={ post.permalink } onClick={ props.handler }>
				<SearchResultTitle>{ post.post_title }</SearchResultTitle>
			</SearchResultLink>
		</Row>
	);
}

SearchResult.propTypes = {
	handler: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

/**
 * Wraps the search results.
 */
const SearchResultsWrapper = styled.div`
	margin-top: 20px;
	clear: both;
`;

/**
 * The no results text paragraph.
 */
const NoResults = styled.p`
	margin-left: 10px;
`;

/**
 * Create the ReactElement to render a list of search results.
 *
 * @param {object} props The React props.
 *
 * @returns {ReactElement} A list of search results.
 */
class SearchResults extends React.Component {

	/**
	 * Constructs the component and sets its initial state.
	 *
	 * @param {Object} props The props to use for this component.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		this.state = {
			results: props.results,
		};
	}

	/**
	 * Handles the situation that there are zero results.
	 *
	 * @returns {ReactElement|null} A message stating that no results were found or null if no search term was provided.
	 */
	handleZeroResults() {
		if ( this.props.searchString !== "" ) {
			return this.renderNoResultsFound();
		}

		return null;
	}

	/**
	 * Renders a no results found text.
	 *
	 * @returns {ReactElement} The no results found text.
	 */
	renderNoResultsFound() {
		const noResultsText = this.props.intl.formatMessage( messages.noResultsText );

		a11ySpeak( noResultsText );

		return (
			<NoResults>
				{ noResultsText }
			</NoResults>
		);
	}

	/**
	 * Maps the results to SearchResult components.
	 *
	 * @param {Object} results The results returned by Algolia.
	 *
	 * @returns {Array} Array containing the mapped search results.
	 */
	resultsToSearchItem( results ) {
		return results.map( ( result, index ) => {
			return <SearchResult
				height="32px"
				key={ result.objectID }
				post={ result }
				handler={ ( event ) => {
					event.preventDefault();
					this.props.handler( index );
				} }
			/>;
		} );
	}

	/**
	 * Renders the search results list.
	 *
	 * @returns {ReactElement} A div with either the search results, or a div with a message that no results were found.
	 */
	render() {
		let resultsCount = this.props.results.length;

		// Check whether no results are returned.
		if ( resultsCount <= 0 ) {
			return this.handleZeroResults();
		}

		const foundResultsText = this.props.intl.formatMessage( messages.foundResultsText, {
			resultsCount: resultsCount,
		} );

		a11ySpeak( foundResultsText );

		return (
			<SearchResultsWrapper>
				<ZebrafiedListTable>
					{ this.resultsToSearchItem( this.props.results ) }
				</ZebrafiedListTable>
			</SearchResultsWrapper>
		);
	}

}

SearchResults.propTypes = {
	intl: intlShape,
	handler: PropTypes.func.isRequired,
	searchString: PropTypes.string,
	results: PropTypes.array,
};

SearchResults.defaultProps = {
	searchString: "",
	results: [],
};

export default injectIntl( SearchResults );
