import * as React from 'react';
import { ConnectHOC, Client, query } from 'urql';
import { IRouteProps } from '../../routing';
import { Consumer, selectArtistViewing, setArtistViewing } from '../../store';
import { ArtistTopTracks } from '../../components/artist';
import './style.css';

interface Props extends IRouteProps {
  id: string;
  client: Client;
}

export class ArtistPage extends React.PureComponent<Props, {}> {
  public componentDidMount() {
    const { client, id } = this.props;

    client.executeQuery(query(GetArtist, { id }), true)
      .then((res: any) => {
        setArtistViewing(res.data.artist);
      });

    client.executeQuery(query(GetArtistBio, { id}), true)
      .then((res: any) => {
        console.log('artist bio', res);
      });
  }
  public render() {
    const { id } = this.props;
    return (
      <Consumer select={[selectArtistViewing]}>
        {(artistViewing: any) => {
          const { images: [{ url }], name, tracks } = artistViewing;

          return (
            <div className="artist-viewer">
              <div className="main-view-container">
                <div className="artist-viewer__header" style={{ backgroundImage: `url(${url})` }}>
                  <div className="header-image-test">test</div>
                </div>
                <p>{name}</p>
                <ArtistTopTracks id={id} tracks={tracks} />
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default ConnectHOC()(ArtistPage);

const GetArtist = `
  query($id: String) {
    artist(id: $id) {
      images {
        url
      }
      name
    }
  }
`;

const GetArtistBio = `
  query($id: String) {
    artistBio(id: $id) {
      headerImages {
        url
      }
    }
  }
`