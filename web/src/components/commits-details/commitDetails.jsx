import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  number,
  string,
  arrayOf,
  shape,
  bool,
} from 'prop-types';
import { Link } from 'react-router-dom';
import MDropdown from 'components/ui/MDropdown';
import { getFileDifferences } from 'functions/apiCalls';
import { generateBreadCrumbs } from 'functions/helpers';
import { getTimeCreatedAgo, getCommentFromCommit } from 'functions/dataParserHelpers';
import MScrollableSection from 'components/ui/MScrollableSection/MScrollableSection';
import Navbar from '../navbar/navbar';
import ProjectContainer from '../projectContainer';
import './commitDetails.css';
import CommitsApi from '../../apis/CommitsApi.ts';
import ImageDiffSection from '../imageDiffSection/imageDiffSection';

const imageFormats = [
  '.png',
  '.jpg',
];

const commitsApi = new CommitsApi();

class CommitDetails extends Component {
  constructor(props) {
    super(props);
    const { users } = this.props;
    this.state = {
      commits: {},
      users,
      imagesToRender: [],
      page: 1,
      filesChanged: 0,
      totalPages: '1',
      scrolling: false,
    };
    const {
      projects: { selectedProject: { gid } },
      match: { params: { commitHash } },
    } = this.props;
    commitsApi.getCommitDetails(gid, commitHash)
      .then((response) => {
        this.setState({ commits: response });
        this.loadDiffCommits();
      })
      .catch((err) => err);
  }

  getDiffDetails(diffsArray) {
    const { commits } = this.state;
    const { projects: { selectedProject: { gid } } } = this.props;
    diffsArray.filter((diff) => imageFormats
      .filter((format) => diff.old_path.includes(format))
      .length > 0)
      .forEach(async (imageDiff) => {
        const { imagesToRender } = this.state;
        const {
          previousVersionFile,
          nextVersionFile,
          imageFileSize,
        } = await getFileDifferences(gid, imageDiff, commits.parent_ids[0], commits.id);
        imagesToRender.push({
          previousVersionFileParsed: previousVersionFile,
          nextVersionFileParsed: nextVersionFile,
          imageFileSize,
          fileName: imageDiff.old_path.split('/').slice(-1)[0],
        });
        this.setState({ ...imagesToRender });
      });
  }

   handleFileScroll = () => {
     const { scrolling, page, totalPages } = this.state;
     if (scrolling) return null;
     if (totalPages <= page) return null;

     this.loadMoreCommits();

     return null;
   };

  loadDiffCommits = () => {
    const {
      match: {
        params: { commitHash },
      },
    } = this.props;
    const { page } = this.state;
    const { projects: { selectedProject: { gid } } } = this.props;

    commitsApi
      .getCommitDiff(gid, commitHash, page, true)
      .then((res) => {
        this.setState({
          totalPages: res.totalPages,
          filesChanged: res.totalFilesChanged,
          scrolling: false,
        });
        return this.getDiffDetails([...res.body]);
      })
      .catch(
        (err) => err,
      );
  };

  loadMoreCommits = () => {
    this.setState((prevState) => ({
      page: prevState.page + 1,
      scrolling: true,
    }), this.loadDiffCommits);
  };

  aprox = (floatValue) => Math.floor(floatValue);

  render() {
    const {
      commits,
      users,
      imagesToRender,
      filesChanged,
    } = this.state;
    const commitId = commits.short_id;
    const {
      projects: {
        selectedProject,
        selectedProject: {
          defaultBranch,
        },
      },
      match: {
        params: {
          namespace, slug, commitHash,
        },
      },
    } = this.props;
    let avatarUrl = 'https://assets.gitlab-static.net/uploads/-/system/user/avatar/3839940/avatar.png';
    let avatarName = '';

    const customCrumbs = [
      {
        name: 'Data',
        href: `/${namespace}/${slug}`,
      },
      {
        name: 'Commits',
        href: `/${namespace}/${slug}/-/commits/${defaultBranch}`,
      },
      {
        name: `${commitId}`,
        href: `/${namespace}/${slug}/-/commit/${commitHash}`,
      },
    ];

    users.forEach((contributor) => {
      if (contributor.name === commits.author_name) {
        avatarUrl = contributor.avatar_url;
        avatarName = contributor.name;
      }
    });
    return (
      <div id="commits-view-container">
        <Navbar />
        <ProjectContainer
          activeFeature="data"
          breadcrumbs={generateBreadCrumbs(selectedProject, customCrumbs)}
        />
        <br />
        <br />
        <div className="main-content">
          <div className="wrapper">
            <span className="commit-information">
              <span className="commit-authored">
                {'Commit '}
                <b>{commitId}</b>
                {` authored ${getTimeCreatedAgo(commits.authored_date, new Date())}`}
              </span>
              <a href={`/${avatarName}`}>
                <span style={{ position: 'relative' }}>
                  <img className="avatar-circle m-0" width="25" height="25" src={avatarUrl} alt="avatar" />
                </span>
              </a>
              <span className="author">
                <b>
                  <a href={`/${avatarName}`}>
                    {commits.author_name}
                  </a>
                </b>
              </span>
            </span>
            <div className="other-options">
              <Link to="#foo" className="btn btn-outline-dark px-3 mr-2">
                Browse Files
              </Link>
              <MDropdown
                label="Options"
              />
            </div>
          </div>
          <hr />
          <div className="commit-message">
            <span><b>{commits.title}</b></span>
            { getCommentFromCommit(commits.message) && (
              <div className="messages">
                <pre>{getCommentFromCommit(commits.message)}</pre>
              </div>
            )}
          </div>
          <hr />
          {filesChanged > 1000 && (
          <div className="alert pl-3 pr-3 mb-3">
            <div className="d-flex p-2">
              <i className="fas fa-exclamation-triangle mt-1" />
              <p className="m-0 pl-3">
                Too many items to show. To preserve performance only
                <b>
                  {' 1000 '}
                  of
                  {` ${filesChanged} `}
                </b>
                items are displayed
              </p>
            </div>
          </div>
          )}
          <p className="stats">
            {`Showing ${filesChanged > 1000 ? 1000 : filesChanged} files changed with`}
            <span className="addition">
              {' '}
              {commits.stats ? commits.stats.additions : 0}
              {' '}
              additions
            </span>
            {' '}
            and
            <span className="deleted">
              {' '}
              {commits.stats ? commits.stats.deletions : 0}
              {' '}
              deletions
            </span>
            .
          </p>
          <MScrollableSection className="diff-sections" handleOnScrollDown={this.handleFileScroll}>
            {imagesToRender.map((imageFile) => (
              <ImageDiffSection
                key={imageFile.fileName}
                fileInfo={imageFile}
                fileSize={imageFile.imageFileSize}
                original={imageFile.previousVersionFileParsed}
                modified={imageFile.nextVersionFileParsed}
              />
            ))}
          </MScrollableSection>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projects,
    users: state.users,
  };
}

const project = shape(
  {
    id: string,
    gid: number,
    description: string,
    name: string,
    avatarUrl: string,
    starCount: number,
    forksCount: number,
  },
);

CommitDetails.propTypes = {
  users: arrayOf(shape(
    {
      id: number,
      name: string,
      username: string,
      state: string,
      avatar_url: string,
      web_url: string,
    },
  )).isRequired,
  match: shape({
    path: string,
    url: string,
    isExact: bool,
    params: shape({
      commitId: string,
    }),
  }).isRequired,
  projects: shape({
    all: arrayOf(project),
    selectedProject: project,
  }).isRequired,
};
export default connect(mapStateToProps)(CommitDetails);
